<template>
  <div id="app">
    <notes-login v-if="!loggedIn"></notes-login>
    <div class="container" ref="container">
      <h1 class="header">Notes App</h1>
      <div class="login-prompt">
        You are currently logged in as <strong>{{ currentUser }}</strong>
      </div>
      <button class="logout-button" @click="logout">Logout</button>
      <div>
        <label class="radio-buttons" for="display-all"> 
          <input 
            type="radio" 
            id="display-all" 
            name="filter" 
            value="all"
            checked="true"
            v-model="filter">
          Display All 
        </label>
        <label class="radio-buttons" for="display-pending"> 
          <input 
            type="radio" 
            id="display-pending" 
            name="filter" 
            value="pending"
            v-model="filter">
          Display Pending 
        </label>
        <label class="radio-buttons" for="display-done"> 
          <input 
            type="radio" 
            id="display-done" 
            name="filter" 
            value="done"
            v-model="filter">
          Display Done 
        </label>
      </div>

      <!-- For testing purposes: -->
      <!-- <button class="logout-button" @click="testMethod">Test</button> -->
      <ul>
        <li><notes-create 
              @add="addNotes"
              :currentUser="currentUser">
            </notes-create>
        </li>
        <div v-if="sortedNotes.length === 0">
          <li class="no-data">
            <strong> {{ noNotesPrompt }} </strong>
          </li>
        </div>
        <div v-else>
          <li v-for="note in sortedNotes" :key="note.dataId">
            <notes-main 
              :noteUser="note.dataUser" 
              :noteId="note.dataId" 
              :noteTitle="note.dataTitle" 
              :noteContent="note.dataContent"
              :noteDone="note.dataDone"
              :noteDate="note.dataDate"
              :currentUser="currentUser"
              @edit="editNotes"
              @delete="deleteNotes"
              @toggleDone="toggleDoneNotes"> 
            </notes-main>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
  import NotesMain from "./components/NotesMain.vue"
  import NotesCreate from "./components/NotesCreate.vue"
  import NotesLogin from "./components/NotesLogin.vue"
  import firebase from "./utilities/firebase.js"
  import Vue from 'vue'
  import VueCookies from 'vue-cookies'
  Vue.use(VueCookies)

  export default {
    name: "app",
    data() {
      return {
        notesDatabase: {},
        filter: 'all',
      }
    },
    components: {
      NotesMain,
      NotesCreate,
      NotesLogin
    },
    computed: {
      currentUser: function () {
        return this.$cookies.get('currentUser')
      },
      // returns true if user has notes in database
      checkUserNotes: function () {
        var browserDatabase = this.notesDatabase
        var notesCount = 0
        var pushKeys = Object.keys(browserDatabase)
        pushKeys.forEach( (key) => {
          if ( browserDatabase[key].dataUser === this.currentUser ) {
            notesCount++;
          }
        })
        var res = notesCount > 0 ? true : false
        return res
      },
      loggedIn: function () {
        if (this.$cookies.get('currentUser') == null) {
          return false
        }
        else {
          return true
        }
      },
      sortedNotes: function () {
        var data = this.notesDatabase
        var displayFilter = this.filter
        var sortedList = []
        var pushKeys = Object.keys(data)
        // filter notes as per users request
        pushKeys.forEach( (key) => {
          if (data[key].dataUser === this.currentUser) {
            if ( displayFilter === "all") {
              sortedList.push(data[key])
            } 
            if ( displayFilter === "pending" && data[key].dataDone === false) {
              sortedList.push(data[key])
            }
            if ( displayFilter === "done" && data[key].dataDone === true) {
              sortedList.push(data[key])
            } 
          }
        })
        // sort notes by date
        sortedList.sort((firstNote,secondNote) => {
            if (firstNote.dataDate > secondNote.dataDate) {
              return -1
            } else if (firstNote.dataDate < secondNote.dataDate) {
              return 1
            } else {
              return 0
            }
          })
        return sortedList
      },
      noNotesPrompt: function () {
        var displayFilter = this.filter
        var message = ""
        switch (displayFilter) {
          case "all":
            message = "No notes are posted"
            break;
          case "pending":
            message = "No notes are pending"
            break;
          case "done":
            message = "No notes are checked"
            break;
          default:
            message = "There seems to be a problem with your notes" 
        }
        return message
      }
    },
    methods: {
      // *****method for testing******
      // testMethod() {
      // },
      // function to get snapshot of data in firebase
      getSnapshotFirebase () {
        return firebase.database().ref('notes').once('value')
        .then( (snapshot) => {
          return snapshot
        })
      },
      // function that append new notes
      addNotes (emitData) {
        var newDatabase = this.notesDatabase
        var pushKey = emitData.pushKey
        var newData = emitData.newData
        newDatabase[pushKey] = newData
        // force reload
        this.notesDatabase = {}
        this.notesDatabase = newDatabase
      },
      // function to log user out
      logout () {
        firebase.auth().signOut().then( () => {
          this.loggedIn = false
          this.$cookies.remove('currentUser')
          location.reload()
        })
      },
      // function that updates local Done on checkbox change
      toggleDoneNotes (data) {
        var browserDatabase = this.notesDatabase
        var pushKeys = Object.keys(browserDatabase)
        pushKeys.forEach( (key) => {
          if ( browserDatabase[key].dataId === data.dataId ) {
            browserDatabase[key].dataDone = data.dataDone
          }
        })
      },
      deleteNotes (pushId) {
        var browserDatabase = this.notesDatabase
        var updatedDatabase = {}
        var pushKeys = Object.keys(browserDatabase)
        pushKeys.forEach( (key) => {
          if (key !== pushId) {
            updatedDatabase[key] = browserDatabase[key]
          }
        })
        this.notesDatabase = updatedDatabase
      },
      editNotes (data) {
        var pushId = data.pushId
        var noteData = data.noteUpdates
        this.notesDatabase[pushId] = noteData
      }
    },
    mounted () {
      // change opacity if a user is loggedIn
      if (this.$cookies.get('currentUser') != null) {
        this.$refs.container.style.opacity = 1
      }
    },
    created () {
      // get data from firebase for logged-in user
      var database = firebase.database()
      database.ref('notes').once('value')
      .then( (snapshot) => {
        this.notesDatabase = snapshot.val()
      })
    }  
  }
  
</script>

<style>
textarea, input {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 0.9em;
}
.container {
  opacity: 0.1;
  font-family: "Source Sans Pro", sans-serif;
  color: #2c3e50;
  margin-top: 60px;
  margin: auto;
  width: 70%;
  border: 3px solid #4bf8f8;
  padding: 0px;
  background-color: #4fffff30;
  border-radius: 5px;
  text-align: center;
}
.header {
  position: relative;
  font-size: 3em;
  margin-bottom: 5px;
}
.logout-button {
  border-color: #ffffff;
  padding: 5px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 20px 10px;
  cursor: pointer;
  width: 18%;
  height: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  text-transform: uppercase;
  font-size: 0.7em;
}
.login-prompt {
  text-align: center;
  font-size: 1em;
  margin: 5px;
}
ul {
  list-style-type: none;
  padding: 5px;
  text-align: center;
  margin: auto;
}
li {
  margin: 15px auto 15px auto;
}
.no-data {
  font-size: 1.2em;
  color: red;
}
.radio-buttons {
  margin: 15px;
}

</style>
