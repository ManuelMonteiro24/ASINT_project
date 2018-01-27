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
      <interface :admin="profile['admin']" :profile="profile.admin" v-on:render="fetchData" v-on:roomup="reemit"></interface>
      <button v-on:click="logout" v-on:render="fetchData" class="logout-btn">Logout</button><br><br>
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
        var _this = this
        _this.$data.loadingData = true

        fetch('/api/state', { credentials: 'same-origin' }).then(function(resp) {
          if(resp.status !== 401) {
            return resp.json();
          } else {
            _this.$emit('roomup', false)
          }
        }).then(function(data) {
          _this.$data.loadingData = false
          if(data){
            if(data.subscribed) {
              _this.$data.profile = _.omit(data, 'subscribed')
              _this.$emit('roomup', data.subscribed)
            } else {
              _this.$data.profile = data
              _this.$emit('roomup', false)
            }
            _this.$data.userState = true //authenticated
          } else {
            _this.$data.userState = false
          }
        }).catch(err => { throw err; }); //TODO handler error
      },
      reemit: function(arg) {
        this.$emit('roomup', arg)
      },
    },
  }
</script>

<style>
  button {
    margin-top: 10px;
  }
  .logout-btn {
    position:relative;
    margin-top: 30px;
  }
</style>
