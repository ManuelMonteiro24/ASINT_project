<template>

  <div v-if="loadingData" class="css-main-font">
    <h1>Loading Home Page</h1>
  </div>

  <div v-else class="css-main-font">
    <h1>Home Page</h1>

    <div v-if="!userState">
      <router-link :to="{ name: 'login', params: {}}">Login</router-link>
    </div>

    <div v-else>
      <h2>Welcome {{ profile.displayName }}</h2>
      <h3 v-if="!profile.admin">{{ profile.username }}</h3>
      <interface :admin="profile['admin']" v-on:render="fetchData"></interface>
      <button v-on:click="logout" v-on:render="fetchData">Logout</button><br><br>
    </div>

  </div>

</template>

<script>
  var _ = require('underscore');

  export default {
    data() {
      return { userState: false, loadingData: false, profile: {} };
    },
    created() {
      //fetch user profile information after navigation
      this.fetchData()
    },
    methods: {
      logout: function() {
        var _this = this
        fetch('/logout', { credentials: 'same-origin' }).then(function(resp){
          _this.fetchData()
        }).catch( err => { throw err; }); //TODO handler error
      },
      fetchData: function() {
        var $data = this.$data
        $data.loadingData = true

        fetch('/api/state', { credentials: 'same-origin' }).then(function(resp) {
          if(resp.status !== 401) {
            return resp.json();
          }
        }).then(function(data) {
          $data.loadingData = false
          if(data){
            $data.profile = _.omit(data, 'status')
            $data.userState = true //authenticated
          } else {
            $data.userState = false
          }
        }).catch(err => { throw err; }); //TODO handler error
      },
    },
  }
</script>

<style>
  button {
    margin-top: 10px;
  }
  .scrollable {
    overflow-y: scroll;
  }
</style>
