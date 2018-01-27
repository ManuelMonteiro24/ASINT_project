<template>
  <div class="css-main-font css-login">
      <h1>Login Page</h1>
      <button v-on:click="loginAdmin">Login as Admin</button>
      <button v-on:click="loginUser">Login as Regular User</button>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        userLoginRedirectLink: "https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=1132965128044593&redirect_uri=http://localhost:3000/login/user/",
      };
    },
    methods: {
      loginAdmin: function() {
        this.$router.push({ name: 'adminlogin' });
      },
      loginUser: function() {
        this.$router.push({ name: 'redirect', params: { redirectLink: this.userLoginRedirectLink } });
      },
    }
  }
</script>

<style scoped>
  .css-login {
    text-align: center;
  }
  button {
    position: relative;
    float: top;
  }
</style>
