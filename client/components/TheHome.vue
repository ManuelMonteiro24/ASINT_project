<template>
  <div class="root-elem">
    <h1>Home Page</h1>
    <div v-if="!userStatus">
      <router-link :to="{ name: 'login', params: {}}">Login</router-link>
    </div>
    <h2 v-else>Welcome</h2>
  </div>
</template>

<script>
  //Initialize TheHome instance
  var userStatus = false;
  fetch('/login/status').then(function(resp) {
    return resp.json();
  }).then(function(data) {
    if(data.status){
      console.log('true')
      userStatus = true;
    } else {
      console.log('false')
    }

  }).catch(err => { throw err; });

  export default {
    data: function() {
      var data = { userStatus }
      return data;
    },
  }
</script>
