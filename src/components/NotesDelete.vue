<template>
  <div class="notes-delete">
      <p> Are you sure you want to delete this note? </p>
      <button @click="deleteYes" class="button note-button delete-button">Yes</button>
      <button @click="deleteNo" class="button note-button">No</button>
  </div>
</template>
<script>
  import firebase from "../utilities/firebase.js"
  export default {
    props: {
      noteId: { type: String }
    },
    methods: {
      // function to get snapshot of data in firebase
      getSnapshotFirebase () {
        return firebase.database().ref('notes').once('value')
        .then( (snapshot) => {
          return snapshot.val()
        })
      },
      // function to get a pushID that match the searchID
      getFirebasePushId (snapshot, searchId) {
        var databasePushIds = Object.keys(snapshot)
        var notePushId = ""
        databasePushIds.forEach( (pushId) => {
          if (snapshot[pushId].dataId === searchId) {
            notePushId = pushId
          }
        })
        return notePushId
      },
      //function to toggle delete view and emit noteid to delete
      deleteYes () {
        var searchId = this.noteId
        this.getSnapshotFirebase()
        // get which pushId correspond to the note that needs to be deleted
        .then( (snapshot) => {
          var pushId = this.getFirebasePushId(snapshot, searchId)
          return pushId 
        })
        // remove note with pushId that corresponds to the searchId
        .then( (pushId) => {
          firebase.database().ref('notes/' + pushId).remove()
          // emit
          this.$emit('delete-yes',pushId)
          // toggle
          this.initDelete = !this.initDelete
        })
        .then( () => {
        })
      },
      deleteNo() {
        this.$emit('delete-no')
      },
    }
  }
    
</script>
<style>
  .button {
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
  .notes-delete {
    padding: 8px;
    text-align: center;
  }
  /* to center note-buttons */
  .note-button {
    margin: 5px 30px 5px 30px;
  }
  .delete-button {
    background-color: red !important;
    border-color: red !important;
    color: #ffffff !important;
  }
</style>