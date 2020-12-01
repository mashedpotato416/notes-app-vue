<template>
  <div class="alert alert-danger text-center" role="alert">
      <p> Are you sure you want to delete this note? </p>
      <button @click="deleteYes" class="px-4 mx-3 btn btn-danger">Yes</button>
      <button @click="deleteNo" class="px-4 mx-3 btn btn-secondary">No</button>
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
</style>