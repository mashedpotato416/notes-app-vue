<template>
  <div v-if="!initEdit" class="alert alert-info my-2 container-fluid">
    <div class="row row align-items-center">  
      <!-- checkbox -->
      <div class="col-2 col align-self-start">
        <div class="ml-4 mt-3">
          <input 
            type="checkbox" 
            class="form-check-input"
            style="height: 35px; width: 35px;"
            :checked="isNoteDone"
            @change="toggleNoteDone">
        </div>
      </div>
      <!-- notecontent -->
      <div class="col-10">
        <div class="my-2 text-justify text-left text-break">
          <strong>{{ noteTitle }}</strong>
        </div>
        <div class="my-2">
          <p 
            class="lead text-justify text-right text-break"
            style="font-size: 0.95em;">
            {{ noteContent }}
          </p>
        </div>
        <div class="my-2 text-justify text-right">
          <small><em>created/updated: {{ dateUTC }}</em></small>
        </div>
        <!-- buttons -->
        <div class="row">
          <div 
            v-if="!initDelete" 
            class="col align-self-center text-center my-3">
            <button 
              class="btn btn-info px-3 mr-5" 
              @click="onEdit">
              Edit Note
            </button>
            <button 
              class="btn btn-danger mx-3" 
              @click="onDelete">
              Delete Note
            </button>
          </div>
          <div v-else>
            <notes-delete
              :noteId="noteId"
              @delete-yes="yesDelete" 
              @delete-no="onDelete">
            </notes-delete>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="note-block">
    <notes-edit 
      :existId="noteId" 
      :existTitle="noteTitle" 
      :existContent="noteContent" 
      :existUser="noteUser"
      :existDone="isNoteDone"
      @edit-cancel="onEdit"
      @edit-save="doneEdit">
    </notes-edit>
  </div>
</template>
<script>
  import NotesDelete from "./NotesDelete.vue"
  import NotesEdit from "./NotesEdit.vue"
  import firebase from "../utilities/firebase.js"
  export default {
    data() {
      return {
        initDelete: false,
        initEdit: false
      }
    },
    components: {
      NotesDelete,
      NotesEdit
    },
    props: {
        noteId: { type: String },
        noteTitle: { type: String },
        noteContent: { type: String },
        noteUser: { type: String },
        currentUser : { type: String },
        noteDone: { type: Boolean },
        noteDate: { type: Number }
      },
    methods: {
      // function to toggle delete view
      onDelete () {
        this.initDelete = !this.initDelete
      },
      // function to toggle edit view
      onEdit () {
        this.initEdit = !this.initEdit
      },
      // function to toggle delete view and emit signal to refresh
      yesDelete (pushId) {
        this.initDelete = !this.initDelete
        this.$emit('delete', pushId)
      },
      // function to toggle edit view and emit signal to refresh
      doneEdit (data) {
        this.initEdit = false
        this.$emit('edit',data)
      },
      // function that toggle noteDone and update database
      toggleNoteDone () {
        var data = {
          dataId: this.noteId,
          dataDone: !this.noteDone
        }
        var pushId = ""
        // emit data to App.vue
        this.$emit('toggleDone', data)
        // update firebase
        firebase.database().ref('notes').once('value')
        .then( (snapshot) => {
          return snapshot.val()
        })
        // get pushId
        .then( (firebaseData) => {
          var pushKeys = Object.keys(firebaseData)
          pushKeys.forEach( (key) => {
            if ( firebaseData[key].dataId === data.dataId ) {
              pushId = key
            }
          });
        })
        // update firebase
        .then( () => {
          var updates = {}
          updates['/notes/' + pushId + '/dataDone'] = data.dataDone
          firebase.database().ref().update(updates)
        })
      }
    },
    computed: {
      checkUser: function () {
        return this.currentUser === this.noteUser
      },
      isNoteDone: function () {
        return this.noteDone
      },
      dateUTC: function () {
        var dateMiliseconds = parseInt(this.noteDate)
        var date = new Date(dateMiliseconds)
        return date.toUTCString()
      }
    }
  }  
</script>
<style>
</style>