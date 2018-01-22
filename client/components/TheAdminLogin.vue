<template>
  <div v-else>
    <form v-on:submit.prevent="submit">
      <label>Login</label><br>
      <input v-model="login" type="text"><br><br>
      <label>Password</label><br>
      <input v-model="pw" type="password"><br><br><br>
      <p v-if="error">Wrong login or password...</p>
      <input type="button" value="Sign In" v-on:click="submit"><br><br>
    </form>
    <router-link :to="{ name: 'home' }">Home</router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return { error: false, redirect: false, login: undefined, pw: undefined }
    },
    methods: {
      submit: function() {
        var authHeader = new Headers({ 'Authorization': 'Basic ' + btoa(this.$data.login + ':' + this.$data.pw) }) //base64 encoding of ascii string
        var _this = this;
        fetch('/login/admin', { headers: authHeader, credentials: 'same-origin', cache: 'no-cache' }).then(function(resp) {
          if(!resp.ok) {
            _this.$data.error = true
          } else {
            _this.$router.push({ name: 'home' });
          }
        }).catch( err => { throw err; }); //TODO handler error
      },
    }
  }
</script>

<style scoped>
  form {
    position: relative;
    margin: 0 auto;
    width: 20%;
    height: 30%;
    top: 2%;
  }

  label, input[type="text"], input[type="password"] {
    margin-top: 9px;
    font-family: "Times New Roman";
    font-size: 22px;
  }

  input[type="button"] {
    width: 70%;
    font-weight: bold;
  }

  a {
    display: inline-block;
    margin-top: 5%;
  }

  p {
    color: red;
  }
</style>
