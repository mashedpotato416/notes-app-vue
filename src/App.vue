<template>
  <div id="app">
    <div class="container">
      <h1 class="header">Notes App</h1>
      <div class="login-prompt">You are currently logged in as <strong>{{ currentUser }}</strong></div>
      <button class="logout-button" @click="testMethod">Logout</button>
      <ul>
        <li><notes-create @note-added="addNote"></notes-create></li>
        <div>
          <li v-for="note in sortedNotes" :key="note.dataId">
            <notes-main 
              :noteUser="note.dataUser" 
              :noteId="note.dataId" 
              :noteTitle="note.dataTitle" 
              :noteContent="note.dataContent"
              :currentUser="currentUser"
              @deleteId="removeNote"
              @updateNote="updateNotes"> 
            </notes-main>
          </li>
        </div>
        <div v-if="Notes.length === 0">
          <li class="no-data">
            <strong>No notes are posted at the moment.</strong>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>
<script src="https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js"></script>
<script>
import NotesMain from "./components/NotesMain.vue"
import NotesCreate from "./components/NotesCreate.vue"
import uniqueId from "lodash.uniqueid"
import firebase from "./utilities/firebase.js"

export default {
  name: "app",
  components: {
    NotesMain,
    NotesCreate,
  },
  data() {
    return {
      currentUser: "matt_hardy@youjizz.com",
      testVar: "",
      Notes: []
    };
  },
  methods: {
    // function that appends new data from NotesCreate component
    addNote(noteData) {
      var newData = {
        dataUser: this.currentUser,
        dataId: uniqueId(),
        dataTitle: noteData[0],
        dataContent: noteData[1],
        dataDate: noteData[2]
      }
      // --adding new data in firebase--
      var database = firebase.database()
      database.ref('notes').push(newData)
    },
    // function that filters out the matching noteid to delete and
    // assign the filtered array to replace existing array
    removeNote(noteId) {
      var newNotes = this.Notes.filter((note)=>{
        return note.dataId !== noteId
      })
      this.Notes = newNotes
    },
    // function that gets the index of the Note to update and
    // at the same time update the values in it
    updateNotes(updateData) {
      var noteIndex = this.Notes.findIndex((note)=>{
        return note.dataId === updateData[0] && note.dataUser === updateData[4]
      })
      var newNotes = this.Notes
      newNotes[noteIndex] = {
        dataUser: updateData[4],
        dataId: updateData[0],
        dataTitle: updateData[1],
        dataContent: updateData[2],
        dataDate: updateData[3]
      }
      // mutating an array doesn't re-render... delete and create a new one
      this.Notes = []
      this.Notes = newNotes
    },
    testMethod() {
      console.log('Firebase testing...')
      var newNotes = []
      var database = firebase.database()
      // --adding new data in firebase--
      // for (var i=0; i<this.Notes.length; i++) {
      //   console.log(i)
      //   database.ref('notes').push(this.Notes[i])
      // }
      
      // --retrieving data in database--
      database.ref('notes').once('value').then(
        (snapshot) => {
          var databaseNotes = snapshot.val()
          console.log(databaseNotes)
          // moving data to Notes
          var databaseKeys = Object.keys(databaseNotes)
          databaseKeys.forEach( (key) => { newNotes.push(databaseNotes[key]) } )
          this.Notes = []
          this.Notes = newNotes
        }
      )
    },
    testMethod2() {
      console.log('Hi')
    }
  },
  computed: {
    // sort Notes based on dataDate
    sortedNotes:
      function () {
        var sortedNotes = this.Notes
        sortedNotes.sort(
          (firstNote,secondNote) => {
            if (firstNote.dataDate > secondNote.dataDate) {
              return -1
            } else if (firstNote.dataDate < secondNote.dataDate) {
              return 1
            } else {
              return 0
            }
          })
        return sortedNotes
      }
  },
  mounted() {
      function getNotesData() {
        var newNotes = []
        console.log('fetching data from firebase...')
        var database = firebase.database()
        database.ref('notes').once('value')
        .then( (snapshot) => {
            return snapshot.val()
        })
        .then( (data) => {
            var databaseKeys = []
            // var newNotes = []
            databaseKeys = Object.keys(data)
            databaseKeys.forEach( (key) => {
              newNotes.push(data[key])
            })
            // return newNotes
        })
        return newNotes
      }

      this.Notes = getNotesData()
      setInterval( () => { this.Notes = getNotesData() }, 30000)
  }
};
</script>

<style>
#app {
  font-family: "Source Sans Pro", sans-serif;
  color: #2c3e50;
  margin-top: 60px;
}
textarea, input {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 0.9em;
}
.container {
  margin: auto;
  width: 60%;
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
  margin: 2px 2px;
  cursor: pointer;
  width: 20%;
  height: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  text-transform: uppercase;
  font-size: 0.75em;
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
