<template>
  <div class="root-elem">
    <h1>Home Page</h1>
    <button v-on:click="loginAdmin">Login as Admin</button>
    <button v-on:click="loginUser">Login as Regular User</button>
  </div>
</template>

<script>
  export default {
    methods: {
      loginAdmin: function() {
        this.$router.push({name: 'login'});
      },
      loginUser: function() {
        //TODO: fetch GET /login/user
      },
    }
  }
</script>
