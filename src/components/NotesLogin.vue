<template>
  <div class="container-fluid position-absolute bg-info h-100">
    <div class ="row d-flex align-items-center justify-content-center h-100">
      <div class="col-sm-6 border rounded-lg bg-light px-5 py-5 align-middle" style="height: 650px;">
        <div class="lead text-center"> 
          <strong> Welcome to Notes App!<br>Please login.</strong> 
        </div>
        <form onsubmit="event.preventDefault()" class="my-4">
            <div class="px-3">
              <div class="form-group"> 
                <label 
                  class="exampleInputEmail1" 
                  for="user-email">
                    <strong>Email:</strong>
                </label>
                <input 
                  id="user-email" 
                  type="text"
                  size="30"
                  class="form-control"
                  v-model.lazy.trim="userEmail">
                  <small 
                    id="emailHelp" 
                    class="form-text text-muted">
                    Don't worry, we'll never share your email with anyone else.
                  </small>
              </div>
              <div class="form-group"> 
                <label 
                  class="exampleInputEmail1" 
                  for="user-password">
                    <strong>Password:</strong>
                </label>
                <input 
                  id="user-password" 
                  type="password"
                  size="30"
                  class="form-control"
                  v-model.lazy.trim="userPassword">
              </div>
            </div>
            <div 
              class="alert alert-danger text-center" 
              role="alert" 
              ref="errorPrompt" 
              style="visibility: hidden;">
            </div>
            <div class="text-center">
              <button 
                class="btn btn-info"
                @click="onLogin"> 
                Login with Email
              </button>
            </div>
            <!-- for alternatives -->
            <div class="text-center">
              <div class="text-muted my-4">
                or
              </div>
              <!-- <div id="firebaseui-auth-container"></div>
              <div id="loader" class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div> -->
              <div class="my-3">
                <button 
                  class="btn btn-danger"
                  @click="onLogin"> 
                  Login with Google 
                </button>
              </div>
              <div class="my-3">
                <button 
                  class="btn btn-secondary"
                  @click="onLogin"> 
                  Login with GitHub 
                </button>
              </div>
            </div> 
        </form>
      </div>
    </div>
  </div>
</template>
<script>
  import firebase from "../utilities/firebase.js"
  // import * as firebaseui from 'firebaseui'
  // import 'firebaseui/dist/firebaseui.css'

  export default {
    data() {
      return {
        userEmail: "",
        userPassword: ""
      }
    },
    methods: {
      onLogin () {
        console.log('Loging in ...')
        var email = this.userEmail
        var password = this.userPassword
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          this.$cookies.set('currentUser', user.user.email)
          location.reload()
        })
        .catch((error) => {
          var errorMessage = error.message;
          this.$refs.errorPrompt.style = 'visibility: visible;'
          this.$refs.errorPrompt.innerHTML = errorMessage
        });
      }
    },
    // mounted() {
    //   var uiConfig = {
    //     callbacks: {
    //       // user data is extracted here
    //       signInSuccessWithAuthResult: (authResult) => {
    //         this.$cookies.set('currentUser', authResult.user.email)
    //         return true
    //       },
    //       // function that fires when UI render is ready
    //       uiShown: function () {
    //         document.getElementById('loader').style.display = 'none';
    //       }
    //     },
    //     // for development
    //     // signInSuccessUrl: 'http://localhost:8080/',
    //     // for deploy
    //     signInSuccessUrl: 'https://notes-app-vue-a42c9.web.app/',
    //     // sign in options from firebase
    //     signInOptions: [
    //       // {
    //       //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //       //   requireDisplayname: false
    //       // },
    //       firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //       firebase.auth.GithubAuthProvider.PROVIDER_ID
    //     ]
    //   }
    //   var ui = new firebaseui.auth.AuthUI(firebase.auth())
    //   ui.start('#firebaseui-auth-container', uiConfig)
    // }
  }  
</script>
<style>

</style>