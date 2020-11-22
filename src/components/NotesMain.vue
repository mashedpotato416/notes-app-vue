<template>
  <div v-if="!initEdit" class="note-block">
    <div class="note-title"><strong>{{ noteTitle }}</strong></div>
    <div class="note-content">{{ noteContent }}</div>
    <div class="note-user"><em>by: {{ noteUser }}</em></div>
    <!-- <div v-if="checkUser"> -->
      <div v-if="!initDelete" class="note-buttons">
        <button class="button note-button" @click="onEdit">Edit</button>
        <button class="button note-button delete-button" @click="onDelete">Delete</button>
      </div>
      <div v-else>
      <notes-delete @delete-yes="yesDelete" @delete-no="onDelete"></notes-delete>
      </div>
    <!-- </div> -->
  </div>
  <div v-else class="note-block">
    <notes-edit 
      :existId="noteId" 
      :existTitle="noteTitle" 
      :existContent="noteContent" 
      :existUser="noteUser"
      @edit-cancel="onEdit"
      @edit-save="saveEdit">
    </notes-edit>
  </div>
</template>
<script>
  import NotesDelete from "./NotesDelete.vue"
  import NotesEdit from "./NotesEdit.vue"
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
        currentUser : { type: String }
      },
    methods: {
      //function to toggle delete view
      onDelete() {
        this.initDelete = !this.initDelete
      },
      //function to toggle delete view and emit noteid to delete
      yesDelete() {
        this.$emit('deleteId',this.noteId)
        this.initDelete = !this.initDelete
      },
      //function to toggle edit view
      onEdit() {
        this.initEdit = !this.initEdit
      },
      //function to toggle edit view and emit new data
      saveEdit(updateData) {
        // this.noteTitle = updateData[1]
        // this.noteContent = updateData[2]
        this.$emit('updateNote',updateData)
        this.initEdit = false
      },
      checkUser() {
        return this.currentUser === this.noteUser
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
  .note-user {
    text-align: right;
    padding: 10px;
  }
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

</style>