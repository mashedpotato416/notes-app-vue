<template>
  <div id="app">
    <notes-login v-if="!loggedIn"></notes-login>
    <div class="container" ref="container">
      <h1 class="header">Notes App</h1>
      <div class="login-prompt">You are currently logged in as <strong>{{ currentUser }}</strong></div>
      <button class="logout-button" @click="RefreshNotes">Refresh</button>
      <button class="logout-button" @click="logout">Logout</button>
      <!-- For testing purposes: -->
      <!-- <button class="logout-button" @click="testMethod">Test</button> -->
      <ul>
        <li><notes-create 
              @note-added="RefreshNotes"
              :currentUser="currentUser">
            </notes-create></li>
        <div v-if="Notes === null">
          <li class="no-data">
            <strong>No notes are posted at the moment.</strong>
          </li>
        </div>
        <div v-else>
          <li v-for="note in sortedNotes" :key="note.dataId">
            <notes-main 
              :noteUser="note.dataUser" 
              :noteId="note.dataId" 
              :noteTitle="note.dataTitle" 
              :noteContent="note.dataContent"
              :currentUser="currentUser"
              @refresh="RefreshNotes"> 
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
    components: {
      NotesMain,
      NotesCreate,
      NotesLogin
    },
    data() {
      return {
        Notes: null
      };
    },
    computed: {
      currentUser: function () {
        return this.$cookies.get('currentUser')
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
        var data = this.Notes
        var sortedList = []
          Object.keys(data).forEach( (keys) => {
            sortedList.push(data[keys])
          })
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
          return snapshot.val()
        })
      },
      // function to fetch updates from firebase to Notes
      RefreshNotes () {
        this.getSnapshotFirebase()
        .then( (data) => {
          this.Notes = data
        })
      },
      // function to log user out
      logout () {
        firebase.auth().signOut().then( () => {
          this.loggedIn = false
          this.$cookies.remove('currentUser')
          location.reload()
        })
      }
    },
    mounted () {
      // change opacity if a user is loggedIn
      if (this.$cookies.get('currentUser') != null) {
        this.$refs.container.style.opacity = 1
      }
      // get data for Notes
      var database = firebase.database()
      database.ref('notes').once('value')
      .then( (snapshot) => {
        this.Notes = snapshot.val()
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
  margin: 5px 5px;
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
</style>
