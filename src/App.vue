<template>
  <div id="app">
    <div class="container">
      <h1 class="header">Notes App</h1>
      <div class="login-prompt">You are currently logged in as <strong>{{ currentUser }}</strong></div>
      <button class="logout-button" @click="RefreshNotes">Refresh</button>
      <button class="logout-button" @click="testMethod">Test</button>
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
<script>
import NotesMain from "./components/NotesMain.vue"
import NotesCreate from "./components/NotesCreate.vue"
import firebase from "./utilities/firebase.js"

export default {
  name: "app",
  components: {
    NotesMain,
    NotesCreate,
  },
  data() {
    return {
      currentUser: "jenny_awesome@gmail.com",
      testVar: "",
      Notes: [],
    };
  },
  methods: {
    // function to get snapshot of data in firebase
    getSnapshotFirebase() {
      return firebase.database().ref('notes').once('value')
      .then( (snapshot) => {
        return snapshot.val()
      })
    },
    RefreshNotes() {
      this.getSnapshotFirebase()
      .then( (data) => {
        var dataArray = []
        var databaseKeys = Object.keys(data)
        databaseKeys.forEach( (key) => {
          dataArray.push(data[key])
        })
        this.Notes = dataArray
      })
    },
    getFirebasePushId(snapshot, searchId) {
      var databasePushIds = Object.keys(snapshot)
      var notePushId = ""
      databasePushIds.forEach( (pushId) => {
        if(snapshot[pushId].dataId === searchId) {
          notePushId = pushId
        }
      })
      return notePushId
    },
    // function that appends new data from NotesCreate component
    addNote(noteData) {
      var pushIds = []
      var notesDatabase = {}
      var currentUserIds = []
      var newData = {
        dataUser: this.currentUser,
        dataId: "",
        dataTitle: noteData[0],
        dataContent: noteData[1],
        dataDate: noteData[2]
      }
      this.getSnapshotFirebase()
      // get a list of push() ids
      .then( (data) => {
        notesDatabase = data
        var dataArray = []
        var databaseKeys = Object.keys(data)
        databaseKeys.forEach( (key) => {
          dataArray.push(data[key])
        })
        pushIds = databaseKeys
      })
      // create a list of ids of currentUser
      .then( () => {
        pushIds.forEach( (pushId) => {
          if(notesDatabase[pushId].dataUser === this.currentUser){
            currentUserIds.push(notesDatabase[pushId].dataId)
          }
        })
      })
      // create a new id
      .then( () => {
        var prefix = this.currentUser.slice(0,4) + "-"
        var countIds = (currentUserIds.length === 0) ? 1 : parseInt(currentUserIds[currentUserIds.length - 1].slice(5), 10) + 1
        var newId = prefix + countIds
        return newId
      })
      // upload to firebase
      .then( (newId) => {
        //set dataId to the Id created
        newData.dataId = newId
        firebase.database().ref('notes').push(newData)
      })
      .then( this.RefreshNotes )
    },
    // function that delete note with specified noteId in the database
    removeNote(noteId) {
      var searchId = noteId
      this.getSnapshotFirebase()
      // get which pushId correspond to the note that needs to be deleted
      .then( (snapshot) => {
        var pushId = this.getFirebasePushId(snapshot, searchId)
        return pushId 
      })
      // remove note with pushId that corresponds to the searchId
      .then( (pushId) => {
        firebase.database().ref('notes/' + pushId).remove()
      })
      .then( this.RefreshNotes )
    },
    // function that appends update in the database
    updateNotes(updateData) {
      var searchId = updateData[0]
      var noteUpdates = {
        dataUser: updateData[4],
        dataId: updateData[0],
        dataTitle: updateData[1],
        dataContent: updateData[2],
        dataDate: updateData[3]
      }
      
      this.getSnapshotFirebase()
      // get which pushId correspond to the note that needs to be deleted
      .then( (snapshot) => {
        var pushId = this.getFirebasePushId(snapshot, searchId)
        return pushId 
      })
      .then( (pushId) => {
        firebase.database().ref('notes/' + pushId).update(noteUpdates)
      })
      .then( this.RefreshNotes )
    },
    testMethod() {
      this.getSnapshot().then( this.RefreshNotes )
    }
  },
  computed: {
    sortedNotes: function () {
      var sortedArray = this.Notes
      sortedArray.sort( (firstNote,secondNote) => {
        if (firstNote.dataDate > secondNote.dataDate) {
          return -1
        } else if (firstNote.dataDate < secondNote.dataDate) {
          return 1
        } else {
          return 0
        }
      })
    return sortedArray
    }
  },
  mounted() {
    // function that gets data from firebase database
    function getData() {
      var database = firebase.database()
      return database.ref('notes').once('value')
      .then( (snapshot) => {
        return snapshot.val()
      })
      .then( (data) => {
        var dataArray = []
        var databaseKeys = Object.keys(data)
        databaseKeys.forEach( (key) => {
          dataArray.push(data[key])
        })
        return dataArray
      })
    }
    
    // update data once we get firebase response
    getData().then( (dataArray) => {
      this.Notes = dataArray
    })

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
