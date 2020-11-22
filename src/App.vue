<template>
  <div id="app">
    <div class="container">
      <h1 class="header">Notes App</h1>
      <div class="login-prompt">You are currently logged in as <strong>{{ currentUser }}</strong></div>
      <button class="logout-button">Logout</button>
      <p> {{ testVar }} </p>
      <ul>
        <li><notes-create @note-added="addNote"></notes-create></li>
        <li v-for="note in sortByDate(Notes)" :key="note.dataId">
          <notes-main 
            :noteUser="note.dataUser" 
            :noteId="note.dataId" 
            :noteTitle="note.dataTitle" 
            :noteContent="note.dataContent"
            @deleteId="removeNote"
            @updateNote="updateNotes"> 
          </notes-main>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NotesMain from "./components/NotesMain.vue"
import NotesCreate from "./components/NotesCreate.vue"
import uniqueId from "lodash.uniqueid"

export default {
  name: "app",
  components: {
    NotesMain,
    NotesCreate,
  },
  data() {
    return {
      currentUser: "hector.vergara416@gmail.com",
      testVar: "",
      Notes: [
        {
          dataUser: "steve_austin@gmail.com",
          dataId: uniqueId(),
          dataTitle: "Does anybody have, a cold beer for Steve Austin?!??!!?",
          dataContent: "I'll open up a can of whoop-ass on you!” “That was the absolute worst catch phrase I've ever heard in the history of Monday Night Raw.” “Last time I had three or four of those I crapped for three days straight!",
          dataDate: new Date(0)
        },
        {
          dataUser: "john_cena@yahoo.com",
          dataId: uniqueId(),
          dataTitle: "Loyalty",
          dataContent: "When people show loyalty to you, you take care of those who are with you. It's how it goes with everything. If you have a small circle of friends, and one of those friends doesn't stay loyal to you, they don't stay your friend for very long.",
          dataDate: new Date(86400000*14)
        },
        {
          dataUser: "eddie_guerrero@hotmail.com",
          dataId: uniqueId(),
          dataTitle: "Lie Cheat Steal",
          dataContent: "If you're not cheating, you're not trying",
          dataDate: new Date(86400000)
        },
        {
          dataUser: "dwayne_johnson@fakewebsite.com",
          dataId: uniqueId(),
          dataTitle: "The Rock Mentality",
          dataContent: "I'll never, ever be full. I'll always be hungry. Obviously, I'm not talking about food. Growing up, I had nothing for such a long time. Someone told me a long time ago, and I've never forgotten it, ‘Once you've ever been hungry, really, really hungry, then you'll never, ever be full.",
          dataDate: new Date(86400000*7)
        },
      ],
    };
  },
  methods: {
    // function that appends new data from NotesCreate component
    addNote(noteData) {
      var newData = {
        dataUser: this.currentUser,
        dataId: uniqueId(),
        dataTitle: noteData[0],
        dataContent: noteData[1],
        dataDate: noteData[2]
      }
      this.Notes.push(newData)
    },
    // function that filters out the matching noteid to delete and
    // assign the filtered array to replace existing array
    removeNote(noteId) {
      var newNotes = this.Notes.filter((note)=>{
        return note.dataId !== noteId
      })
      this.Notes = newNotes
    },
    // function that gets the index of the Note to update and
    // at the same time update the values in it
    updateNotes(updateData) {
      var noteIndex = this.Notes.findIndex((note)=>{
        return note.dataId === updateData[0] && note.dataUser === updateData[3]
      })
      var newNotes = this.Notes
      newNotes[noteIndex] = {
        dataUser: updateData[3],
        dataId: updateData[0],
        dataTitle: updateData[1],
        dataContent: updateData[2]
      }
      // mutating an array doesn't re-render... delete and create a new one
      this.Notes = []
      this.Notes = newNotes
    },
    sortByDate(noteArray) {
      var newNotes = noteArray.sort(
      (firstNote,secondNote) => {
        if (firstNote.dataDate > secondNote.dataDate) {
          return -1
        } else if (firstNote.dataDate < secondNote.dataDate) {
          return 1
        } else {
          return 0
        }
      })
      return newNotes
    }
  },
  updated() {
    console.log('Page loaded')
  }
};
</script>

<style>
#app {
  font-family: "Source Sans Pro", sans-serif;
  color: #2c3e50;
  margin-top: 60px;
}
textarea, input {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 0.9em;
}
.container {
  margin: auto;
  width: 60%;
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
ul {
  list-style-type: none;
  padding: 5px;
  text-align: center;
  margin: auto;
}
li {
  margin: 15px auto 15px auto;
}
</style>
