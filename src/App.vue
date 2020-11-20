<template>
  <div id="app">
    <div class="container">
      <h1 class="header">Notes App</h1>
      <div class="login-prompt">You are currently logged in as hector.vergara416@gmail.com</div>
      <button class="logout-button" @click="testMethodApp">Logout</button>
      <div v-for="note in Notes" :key="note.dataId">
        <notes-main
        :noteUser="note.dataUser"
        :noteTitle="note.dataTitle"
        :noteContent="note.dataContent">
        </notes-main>
      </div>
    </div>
  </div>
</template>

<script>
import NotesMain from './components/NotesMain.vue'
import uniqueId from 'lodash.uniqueid';

export default {
  name: 'app',
  components: {
    NotesMain
  },
  data() {
    return {
      Notes: [
          {
            dataUser: 'steve_austin@gmail.com',
            dataId: uniqueId('note-'),
            dataTitle: "Does anybody have, a cold beer for Steve Austin?!??!!?",
            dataContent: "I'll open up a can of whoop-ass on you!” “That was the absolute worst catch phrase I've ever heard in the history of Monday Night Raw.” “Last time I had three or four of those I crapped for three days straight!"
          },
          {
            dataUser: 'john_cena@yahoo.com',
            dataId: uniqueId('note-'),
            dataTitle: "Loyalty",
            dataContent: "When people show loyalty to you, you take care of those who are with you. It's how it goes with everything. If you have a small circle of friends, and one of those friends doesn't stay loyal to you, they don't stay your friend for very long."
          }
        ]
    };
  },
  methods: {
    testMethodApp() {
      console.log(this.Notes[0]['dataUser'])
    }
  }
}
</script>

<style>
#app {
  font-family: 'Source Sans Pro', sans-serif;
  color: #2c3e50;
  margin-top: 60px;
}
.container {
  margin: auto;
  width: 50%;
  border: 3px solid #4bf8f8;
  padding: 0px;
  background-color: #4fffff30;
  border-radius: 5px;
  text-align: center;
}
.header {
  position: relative;
  font-size: 3em;
  margin-bottom: 5px;
}
.logout-button {
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
.login-prompt {
  text-align: center;
  font-size: 1em;
  margin: 5px;
}
</style>
