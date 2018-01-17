<template>
  <div class="root-elem">
    <div v-if="!regUsr">
      <h1>Login Page</h1>
      <button v-on:click="loginAdmin">Login as Admin</button>
      <button v-on:click="toggleUserLogin">Login as Regular User</button>
    </div>
    <div v-else>
      <object type="text/html" data="https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=1132965128044593&redirect_uri=http://localhost:3000/login/user/" width="800px" height="600px" >
      </object>
      <a v-on:click="toggleUserLogin">Back</a>
    </div>
  </div>
</template>

<script>
  var data = { regUsr: false };

  export default {
    data: function() {
      return data;
    },
    methods: {
      loginAdmin: function() {
        this.$router.push({name: 'login'});
      },
      toggleUserLogin: function() {
        this.$data.regUsr = !this.$data.regUsr;
      },
    }
  }
</script>
