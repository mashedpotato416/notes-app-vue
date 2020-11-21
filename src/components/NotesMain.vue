<template>
  <div class="note-block">
    <div class="note-title"><strong>{{ noteTitle }}</strong></div>
    <div class="note-content">{{ noteContent }}</div>
    <div class="note-user"><em>by: {{ noteUser }}</em></div>
    <div v-if="!initDelete" class="note-buttons">
      <button class="button note-button">Edit</button>
      <button class="button note-button delete-button" @click="onDelete">Delete</button>
    </div>
    <div v-else>
    <notes-delete @delete-yes="yesDelete" @delete-no="onDelete"></notes-delete>
    </div>
  </div>
</template>
<script>
  import NotesDelete from "./NotesDelete.vue";
  export default {
    data() {
      return {
        initDelete: false
      }
    },
    components: {
      NotesDelete
    },
    props: {
        noteId: { type: String },
        noteTitle: { type: String },
        noteContent: { type: String },
        noteUser: { type: String }
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