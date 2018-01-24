<template>

  <div v-if="loadingData">
    <h1>Loading Home Page</h1>
  </div>

  <div v-else>
    <h1>Home Page</h1>

    <div v-if="!userState">
      <router-link :to="{ name: 'login', params: {}}">Login</router-link>
    </div>

    <div v-else >
      <h2>Welcome {{ profile.displayName }}</h2>
      <h3 v-if="!profile.admin">{{ profile.username }}</h3>
      <button v-on:click="logout" v-on:render="fetchData">Logout</button>
      <options-interface :admin="profile['admin']" v-on:render="fetchData"></options-interface>

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
        fetch('/api/logout', { credentials: 'same-origin' }).then(function(resp){
          if(resp.ok) {
            //fetch user profile information after navigation
            _this.fetchData()
          } else {
            _this.$data.error = true
          }
        }).catch( err => { throw err; }); //TODO handler error
      },
      fetchData: function() {
        var $data = this.$data
        $data.loadingData = true

        fetch('/api/state', { credentials: 'same-origin' }).then(function(resp) {
          return resp.json();
        }).then(function(data) {
          $data.loadingData = false
          if(data.status){
            $data.profile = _.omit(data, 'status')
          }
          $data.userState = data.status
        }).catch(err => { throw err; }); //TODO handler error
      },
    },
  }
</script>

<style>
</style>
