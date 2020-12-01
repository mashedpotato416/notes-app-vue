<template>
  <div class="alert alert-info my-2 container-fluid">
    <div class="edit-flex">
      <div class="form-group">
        <label 
          for="editTitle" 
          class="font-weight-bold text-dark"
          style="font-size: 0.9em">
          Title:
        </label>
        <input 
          type="text"
          id="editTitle" 
          class="form-control"
          autocomplete="off" 
          ref="refTitle"
          v-model.trim="editTitle">
      </div>
      <div class="form-group">
        <label 
          for="editContent" 
          class="font-weight-bold text-dark"
          style="font-size: 0.9em">
          Content:
        </label>
        <textarea 
          class="form-control" 
          rows="4"
          id="editContent"
          autocomplete="off" 
          ref="refContent"
          v-model.lazy.trim="editContent">
        </textarea>
      </div>
      <div 
        class="alert alert-danger text-center" 
        role="alert" 
        ref="editError" 
        style="visibility: hidden;">
      </div> 
    </div>
    <div class="col align-self-center text-center">
      <button class="btn btn-warning px-4 mx-4" @click="onSave">Save</button>
      <button class="btn btn-secondary px-3 mx-4" @click="onCancel">Cancel</button>
    </div>
  </div>
</template>
<script>
  import firebase from "../utilities/firebase.js"
  export default {
    data() {
      return {
        editId: "",
        editTitle: "",
        editContent: "",
        editUser: ""
      }
    },
    props: {
      existId: { type: String },
      existTitle: { type: String },
      existContent: { type: String },
      existUser: { type: String },
      existDone: { type: Boolean }
    },
    mounted() {
      // fill up form with existing data
      var title = this.$refs.refTitle
      var content = this.$refs.refContent
      title.value = this.existTitle
      content.value = this.existContent
      // presets if user don't edit these values
      this.editTitle = this.existTitle
      this.editContent = this.existContent
    },
    methods: {
      onCancel () {
        this.$emit('edit-cancel')
      },
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
          if(snapshot[pushId].dataId === searchId) {
            notePushId = pushId
          }
        })
        return notePushId
      },
      // function that appends update in the database
      onSave () {
        // validate inputs
        if (this.editTitle === "" || this.editContent === "" || (this.editTitle === this.existTitle && this.editContent === this.existContent)) {
          if (this.editTitle === this.existTitle && this.editContent === this.existContent) {
            this.$refs.editError.innerHTML = "Changes must be made!"
          } else if (this.editTitle === "" && this.editContent === "") {
            this.$refs.editError.innerHTML = "Entries must not be blank!"
          } else if (this.noteTitle === "") {
            this.$refs.editError.innerHTML = "Title must not be blank!"
          } else {
            this.$refs.editError.innerHTML = "Content must not be blank!"
          }
          this.$refs.editError.style="margin: 10px; visibility: visible;"
          return
        }
        // validate input if blank
        if (this.editTitle === "" || this.editContent === "") {
          return
        }
        // prepare data
        var searchId = this.existId
        var noteUpdates = {
          dataUser: this.existUser,
          dataId: this.existId,
          dataTitle: this.editTitle,
          dataContent: this.editContent,
          dataDate: Date.now(),
          dataDone: this.existDone
        }
        this.getSnapshotFirebase()
        // get which pushId correspond to the note that needs to be deleted
        .then( (snapshot) => {
          var pushId = this.getFirebasePushId(snapshot, searchId)
          return pushId 
        })
        // update
        .then( (pushId) => {
          firebase.database().ref('notes/' + pushId).update(noteUpdates)
          var data = {
            pushId: pushId,
            noteUpdates: noteUpdates
          }
          this.$emit('edit-save', data)
        })
      }
    }
  }
  
</script>
<style>
</style>