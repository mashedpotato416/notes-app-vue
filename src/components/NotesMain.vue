<template>
  <div v-if="!initEdit" class="note-block">
    <div class="checkboxData">
      <div class="note-title">
        <label class="checkbox-container">
          <input 
            type="checkbox" 
            class="checkbox" 
            :checked="isNoteDone"
            @change="toggleNoteDone">
        </label>
        <strong>{{ noteTitle }}</strong>
      </div>
      <div class="note-content">
        {{ noteContent }}
      </div>
      <div class="note-date">
        <em>created/updated: {{ dateUTC }}</em>
      </div>
      <div>
        <div 
          v-if="!initDelete" 
          class="note-buttons">
          <button 
            class="button note-button" 
            @click="onEdit">
            Edit
          </button>
          <button 
            class="button note-button delete-button" 
            @click="onDelete">
            Delete
          </button>
        </div>
        <div v-else>
        <notes-delete
          :noteId="noteId"
          @delete-yes="yesDelete" 
          @delete-no="onDelete"></notes-delete>
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
  .note-block{
    width: 95%;
    background-color: #03f4f4ab;
    border-radius: 12px;
    margin: 8px auto 8px auto;
    text-align: left;
  }
  .note-title {
    padding: 10px;
  }
  .note-content {
    padding: 10px;
    text-align: justify;
    text-justify: inter-word;
  }
  .note-date {
    text-align: right;
    padding: 10px;
    font-size: 0.9em;
  }
  .button {
    border-color: #ffffff;
    padding: 5px;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 5px 5px;
    cursor: pointer;
    width: 100px;
    height: 30px;
    background-color: #ffffff;
    border-radius: 12px;
    text-transform: uppercase;
    font-size: 0.7em;
  }
  .note-buttons {
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
  /************** from w3schools ************/
  .checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  }
  /* On mouse-over, add a grey background color */
  .checkbox-container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .checkbox-container input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  /************** from w3schools ************/

  .checkbox {
    transform: scale(2);
    margin: 5px 15px 5px 5px;
  }

</style>