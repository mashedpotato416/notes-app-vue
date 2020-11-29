<template>
  <div class="fill">
    <div class="login-popup">
      <div class="welcome-message"> 
        <strong> Welcome to Notes App!<br>Please login.</strong> 
      </div>
      <div class="login-message"> 
        <div class="form-email"> 
          <label 
            class="label-text" 
            for="user-email">
              <strong>Email:</strong>
          </label>
          <input 
            id="user-email" 
            type="text"
            size="30"
            v-model.lazy.trim="userEmail">
        </div>
        <div class="form-pass"> 
          <label 
            class="label-text" 
            for="user-password">
              <strong>Password:</strong>
          </label>
          <input 
            id="user-password" 
            type="password"
            size="30"
            v-model.lazy.trim="userPassword">
        </div>
        <div class="form-prompt" ref="errorPrompt">
          TEST MESSAGE
        </div>
        <div>
          <button 
            class="login-button"
            @click="onLogin"> 
            Login 
          </button>
        </div>
        <div class="or-message">
          or
        </div> 
      </div>
      <div id="firebaseui-auth-container"></div>
      <div id="loader"></div>
    </div>
  </div>
</template>
<script>
  import firebase from "../utilities/firebase.js"
  import * as firebaseui from 'firebaseui'
  import 'firebaseui/dist/firebaseui.css'

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
          this.$refs.errorPrompt.style.visibility = 'visible'
          this.$refs.errorPrompt.style.margin = '10px'
          this.$refs.errorPrompt.innerHTML = errorMessage
        });
      }
    },
    mounted() {
      var uiConfig = {
        callbacks: {
          // user data is extracted here
          signInSuccessWithAuthResult: (authResult) => {
            this.$cookies.set('currentUser', authResult.user.email)
            return true
          },
          // function that fires when UI render is ready
          uiShown: function () {
            document.getElementById('loader').style.display = 'none';
          }
        },
        // for development
        // signInSuccessUrl: 'http://localhost:8080/',
        signInSuccessUrl: 'https://notes-app-vue-a42c9.web.app/',
        // sign in options from firebase
        signInOptions: [
          // {
          //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          //   requireDisplayname: false
          // },
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID
        ]
      }
      var ui = new firebaseui.auth.AuthUI(firebase.auth())
      ui.start('#firebaseui-auth-container', uiConfig)
    }
  }  
</script>
<style>
.fill {
  position: fixed;
  top: 0px;
  left: 0px;
  margin: 0px;
  border: 0px;
  height: 100%;
  width: 100%;
  z-index: 20;
  background-color: #00bcd454;
  opacity: 1
}
.center {
  display: flex;
}
.login-popup {
  background-color: white;
  position: fixed;
  width: 50%;
  height: 60%;
  top: 17.5%;
  left: 25%;
  border-radius: 25px;
}
.welcome-message {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 2em;
  text-align: center;
  padding: 5px;
  margin: 50px 20px 20px 20px;
}
.login-message {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 1em;
  text-align: center;
  padding: 5px;
  margin: 5px;
}
/*************** LOADER ******************/
#loader {
  position: fixed;
  top: 35%;
  left: 42.5%;
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/*****************************************/
.form-email .form-password {
  margin: 10px;
  text-align: center;
}
.label-text {
  margin: 5px;
  display: block;
  text-align: center;
}
#user-email #user-password {
  display: block;
}
.or-message {
  display: block;
  margin: 10px;
}
.login-button {
  border-color: #ffffff;
  padding: 5px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 12px 12px;
  cursor: pointer;
  width: 100px;
  height: 30px;
  background-color: #63c1ce;
  border-radius: 12px;
  text-transform: uppercase;
  font-size: 0.75em;
}
.form-prompt {
  visibility: hidden;
  color: red;
}

</style>