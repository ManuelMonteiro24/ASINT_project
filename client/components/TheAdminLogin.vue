<template>
  <div>
    <form v-on:submit.prevent="submit">
      <label>Login</label><br>
      <input type="text" ref="login"><br><br>
      <label>Password</label><br>
      <input type="password" ref="pass"><br><br><br>
      <input type="button" value="Sign In" v-on:click="submit"><br><br>
    </form>
    <router-link :to="{ name: 'home' }">Home</router-link>
  </div>
</template>

<script>
  export default {
    methods: {
      submit: function() {
        //TODO fetch GET /login/admin
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

  .ct-login {
    color: #bd4929;
  }

  a {
    display: inline-block;
    margin-top: 5%;
  }
</style>
