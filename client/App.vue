<template>
  <div class="main">
    <div class="header">
      <h2>Fénix-WebApp</h2>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    router: require('./router.js'),
  }
</script>

<style>
  .main {
    position: fixed;
    width: 100%;
    height: 100%;
  }
  .header {
    position: absolute;
    width: 100%;
    height: 8%;
    text-align: center;
    font-weight: bold;
    background-color: #c3d1d5;
  }
  .container {
    position: absolute;
    top: 8%;
    width: 80%;
    height: 90%;
    margin: 0px;
    padding: 2% 10% 0 10%;
    text-align: center;
    background-color: #dfe8e5;
  }

</style>
