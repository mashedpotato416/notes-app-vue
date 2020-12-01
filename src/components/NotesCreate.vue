<template>
  <div class="px-4 py-4 bg-secondary container-fluid">
    <form onsubmit="event.preventDefault()">
      <div class="form-group">
        <label 
          for="newTitle" 
          class="font-weight-normal text-light">
          Title:
        </label>
        <div class="flex">
          <input 
            type="text"
            class="form-control" 
            id="newTitle"
            autocomplete="off" 
            v-model.lazy.trim="noteTitle" 
            ref="newInput"
            >
        </div>
      </div>
      <div class="form-group">
        <label for="newContent" 
          class="font-weight-normal text-light">
          Content:
        </label>
        <div class="flex">
          <textarea
            class="form-control" 
            id="newContent" 
            rows="4"
            autocomplete="off"  
            v-model.lazy.trim="noteContent"
            ref="newTextarea">
          </textarea>
        </div>
      </div>
      <!-- error prompt -->
      <div 
        class="alert alert-danger text-center" 
        role="alert" 
        ref="createError" 
        style="visibility: hidden;">
      </div>
      <div class="text-center">
        <button class="btn btn-info" @click="onAdd">Add Note</button>
      </div>
    </form>
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
        noteTitle: "",
        noteContent: ""
      }
    },
    methods: {
      onAdd () {
        // validate user input
        if (this.noteTitle === "" || this.noteContent === "") {
          if (this.noteTitle === "" && this.noteContent === "") {
            this.$refs.createError.innerHTML = "Entries must not be blank!"
          } else if (this.noteTitle === "") {
            this.$refs.createError.innerHTML = "Title must not be blank!"
          } else {
            this.$refs.createError.innerHTML = "Content must not be blank!"
          }
          this.$refs.createError.style="margin: 10px; visibility: visible;"
          return
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
          dataDate: Date.now(),
          dataDone: false
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
          // set dataId to the Id created
          newData.dataId = newId
          var newPushKey = firebase.database().ref().child('notes').push().key
          firebase.database().ref('notes/' + newPushKey).set(newData)
          // emit data and pushKey to 'App.vue'
          var emitData = {
            pushKey: newPushKey,
            newData: newData
          }
          this.$emit('add', emitData)
        })
        // clear fields
        .then( () => {
          this.noteTitle = ""
          this.noteContent = ""
          this.$refs.newTextarea.value = ""
          this.$refs.newInput.value = ""
        })
      }
    }
  }
  
</script>
<style>
  
</style>