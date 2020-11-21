<template>
  <div class="notes-delete">
      <p> Are you sure you want to delete this note? </p>
      <button @click="deleteYes" class="button note-button delete-button">Yes</button>
      <button @click="deleteNo" class="button note-button">No</button>
  </div>
</template>
<script>
  export default {
    methods: {
      deleteYes() {
        this.$emit('delete-yes')
      },
      deleteNo() {
        this.$emit('delete-no')
      }
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