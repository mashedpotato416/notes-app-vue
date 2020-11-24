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
  export default {
    data() {
      return {
        noteTitle:"",
        noteContent:""
      }
    },
    methods: {
      onAdd() {
        if(this.noteTitle === "" || this.noteContent === "") {
          return;
        }
        var noteData = [this.noteTitle, this.noteContent, Date.now()]
        this.$refs.newTextarea.value = ""
        this.$refs.newInput.value = ""
        this.$emit('note-added', noteData)
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