<template>

  <div v-if="loadingData" class="loading-screen">
    <h1>Loading Home Page</h1>
  </div>

  <div v-else class="home-root">
    <h1>Home Page</h1>
    <div v-if="!userState">
      <router-link :to="{ name: 'login', params: {}}">Login</router-link>
    </div>
    <h2 v-else>Welcome {{ userProfile.displayName }}</h2>
  </div>

</template>

<script>
  var _ = require('underscore');

  export default {
    data() {
      return { userState: false, loadingData: false, userProfile: {} };
    },
    created() {
      //fetch user profile information after navigation
      this.fetchData()
    },
    methods: {
      fetchData: function() {
        var $data = this.$data
        $data.loadingData = true

        fetch('/login/state', { credentials: 'include' }).then(function(resp) {
          return resp.json();
        }).then(function(data) {
          $data.loadingData = false
          if(data.status){
            $data.userState = data.status
            $data.userProfile = _.omit(data, 'status')
          } else {
            $data.userState = false
          }
        }).catch(err => { throw err; });
      },
    },
  }
</script>
