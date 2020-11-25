<template>
  <div class="fill">
    <div class="login-popup">
      <div class="welcome-message"> <strong> Welcome to Notes App! </strong> </div>
      <div class="login-message"> Choose log in method to proceed </div>
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
  mounted() {
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          this.$emit('logged-in',authResult.user.email)
        return false;
        },
        uiShown: function() {
          document.getElementById('loader').style.display = 'none';
        }
      },
      signInSuccessUrl: 'http://localhost:8080/',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayname: false
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID
      ]
    }
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
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
  margin: 60px 10px 25px 10px;
  text-transform: uppercase;
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
  
</style>