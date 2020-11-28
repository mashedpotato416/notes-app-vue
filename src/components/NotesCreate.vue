<template>
  <div class="new-block">
    <div class="new-title">
      <label for="newTitle"><strong>Title:</strong></label><br>
      <div class="flex">
        <input 
          type="text"
          class="flex1" 
          id="newTitle" 
          v-model.lazy.trim="noteTitle" 
          ref="newInput">
      </div>
    </div>
    <br>
    <div class="new-content">
      <label for="newContent"><strong>Content:</strong></label><br>
      <div class="flex">
        <textarea
          class="flex1" 
          id="newContent" 
          rows="7"  
          v-model.lazy.trim="noteContent"
          ref="newTextarea">
        </textarea>
      </div>
    </div>
    <div class="note-buttons">
      <button class="button note-button" @click="onAdd">Add</button>
    </div>
  </div>
</template>
<script>
import firebase from "../utilities/firebase.js"
  export default {
    props: {
      currentUser : { type: String }
    },
    data() {
      return {
        noteTitle:"",
        noteContent:""
      }
    },
    methods: {
      onAdd() {
        // validate user input
        if(this.noteTitle === "" || this.noteContent === "") {
          return;
        }
        // prepare data
        var pushIds = []
        var notesDatabase = {}
        var currentUserIds = []
        var newData = {
          dataUser: this.currentUser,
          dataId: "",
          dataTitle: this.noteTitle,
          dataContent: this.noteContent,
          dataDate: Date.now()
        }
        firebase.database().ref('notes').once('value')
        .then( (snapshot) => {
          return snapshot.val()
        })
        // check if null then get a list of push() ids
        .then( (data) => {
          notesDatabase = data !== null ? data : {}
          var dataArray = []
          var databaseKeys = Object.keys(notesDatabase)
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
        .then( () => {
          this.$refs.newTextarea.value = ""
          this.$refs.newInput.value = ""
          this.$emit('note-added')
        })
      }
    }
  }
</script>
<style>
/* button styling in NotesMain.vue */
  .new-block {
    width: 95%;
    background-color: #0385f49e;
    border-radius: 12px;
    margin: 8px auto 8px auto;
    text-align: center;
  }
  .new-title, .new-content 
  {
    padding: 10px;
  }
  .clear-button {
    background-color: red !important;
    border-color: red !important;
    color: #ffffff !important;
  }
  .flex {
    display: flex;
  }
  .flex1 {
    flex: 1
  }
</style>