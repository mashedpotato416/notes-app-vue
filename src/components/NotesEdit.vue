<template>
  <div class="note-block">
    <div class="edit-flex">
      <div>
        <input 
          type="text" 
          class="edit-title" 
          ref="refTitle"
          v-model.lazy.trim="editTitle">
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
  },
  methods: {
    onCancel() {
      this.$emit('edit-cancel')
    },
    onSave() {
      // create array of updated values and send to NotesMain
      var updateId = this.existId
      var updateTitle = this.editTitle
      var updateContent = this.editContent
      var updateUser = this.existUser
      var updateData = [updateId, updateTitle, updateContent, updateUser]
      console.log('NotesEdit: '+ updateData)
      this.$emit('edit-save',updateData) 
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