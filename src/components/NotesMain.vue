<template>
<div>
  <ul>
    <li>
      <div class="note-title"><strong>{{ noteTitle }}</strong></div>
      <div class="note-content">{{ noteContent }}</div>
      <div class="note-user"><em>by: {{ noteUser }}</em></div>
      <div class="note-buttons">
        <button class="button note-button">Edit</button>
        <button class="button note-button delete-button" @click="testMethod">Delete</button>
      </div>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  props: {
      noteId: { type: String },
      noteTitle: { type: String },
      noteContent: { type: String },
      noteUser: { type: String }
    },
  methods: {
    testMethod() {
      console.log("Test2");
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
  ul {
    display: inline-block;
    width: 95%;
    background-color: #03f4f4ab;
    list-style-type: none;
    margin: 5px;
    padding: 5px;
    border-radius: 12px;
  }
  li {
    text-align: left;
  }
  .note-title {
    padding: 8px;
  }
  .note-content {
    padding: 8px;
    text-align: justify;
    text-justify: inter-word;
  }
  .note-user {
    text-align: right;
    padding: 8px;
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
    background-color: red;
    border-color: red;
    color: #ffffff;
  }

</style>