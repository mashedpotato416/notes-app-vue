<template>
  <div class="note-block">
    <div class="edit-flex">
      <div>
        <input 
          type="text" 
          class="edit-title" 
          ref="refTitle"
          v-model.trim="editTitle">
      </div>
      <div>
        <textarea 
          class="edit-content" 
          rows="4" 
          ref="refContent"
          v-model.lazy.trim="editContent">
        </textarea>
      </div>  
    </div>
    <div class="edit-user">
      <em>by: {{ existUser }}</em>
    </div>
    <div class="note-buttons">
      <button class="button note-button" @click="onSave">Save</button>
      <button class="button note-button" @click="onCancel">Cancel</button>
    </div>
  </div>
</template>
<script>
  import firebase from "../utilities/firebase.js"
  export default {
    data() {
      return {
        editId:"",
        editTitle:"",
        editContent:"",
        editUser:""
      }
    },
    props: {
      existId: { type: String },
      existTitle: { type: String },
      existContent: { type: String },
      existUser: { type: String },
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
      onCancel() {
        this.$emit('edit-cancel')
      },
      // function to get snapshot of data in firebase
      getSnapshotFirebase() {
        return firebase.database().ref('notes').once('value')
        .then( (snapshot) => {
          return snapshot.val()
        })
      },
      // function to get a pushID that match the searchID
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
      // function that appends update in the database
      onSave() {
        // prepare data
        var searchId = this.existId
        var noteUpdates = {
          dataUser: this.existUser,
          dataId: this.existId,
          dataTitle: this.editTitle,
          dataContent: this.editContent,
          dataDate: Date.now()
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
        })
        .then( () => {
          this.$emit('edit-save')
        })
      }
    }
  }
</script>
<style>
  .edit-flex > div {
    display: flex;
  }
  .edit-title {
    flex:1;
    margin: 10px;
  }
  .edit-content {
    flex:1;
    margin: 10px;
    text-align: justify;
    text-justify: inter-word;
  }
  .edit-user {
    text-align: right;
    padding: 11px;
  }
</style>