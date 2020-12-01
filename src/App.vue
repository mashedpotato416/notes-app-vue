<template>
  <div id="app">
    <!-- LOGIN -->
    <div style="visibility: visibile;" ref="loginPage">
      <notes-login v-if="!loggedIn"></notes-login>
    </div>
    <div style="visibility: hidden;" class="container-fluid position-absolute h-100 bg-light" ref="contentPage">
      <div class ="row d-flex align-items-center justify-content-center h-100">
        <div class="col-sm-8 bg-light align-middle h-100 px-0">
          <h1 class="text-center display-4 font-weight-normal">Notes App</h1>
          <div class="text-center font-italic font-weight-light">
            You are currently logged in as 
              <span class="font-weight-normal text-info">
                <u>{{ currentUser }}</u>
              </span>
          </div>
          <div class="text-center my-3">
            <button class="btn btn-info" @click="logout">Logout</button>
          </div>
          <!-- For testing purposes: -->
          <!-- <button class="logout-button" @click="testMethod">Test</button> -->
          <!-- ADD notes -->
          <div>
            <notes-create 
                  @add="addNotes"
                  :currentUser="currentUser">
            </notes-create>
          </div>
          <!-- toggle buttons -->
          <div class="text-center my-3 brn-group btn-group-toggle" data-toggle="buttons">
            <label class="mx-1 btn btn-secondary active" for="display-all"> 
              <input 
                type="radio" 
                id="display-all" 
                name="filter"
                autocomplete="off" 
                value="all"
                checked="true"
                v-model="filter">
              Display All 
            </label>
            <label class="mx-1 btn btn-secondary" for="display-pending"> 
              <input 
                type="radio" 
                id="display-pending" 
                name="filter"
                autocomplete="off" 
                value="pending"
                v-model="filter">
              Display Pending 
            </label>
            <label class="mx-1 btn btn-secondary" for="display-done"> 
              <input 
                type="radio" 
                id="display-done" 
                name="filter"
                autocomplete="off" 
                value="done"
                v-model="filter">
              Display Done 
            </label>
          </div>
          <!-- DISPLAY Notes -->
          <ul class="list-unstyled">
            <div 
              class="mx-4 text-left font-weight-normal"
              style="font-size: 2em;"> 
              Notes: 
            </div>
            <div v-if="sortedNotes.length === 0">
              <li class="alert alert-warning text-center">
                {{ noNotesPrompt }}
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
          <!-- ************** -->
        </div>
      </div>
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
        this.$refs.loginPage.style = "visibility: hidden;"
        this.$refs.contentPage.style = "visibility: visible;"
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
</style>
