<template>
  <div class="main">
    <div class="header css-main-font">
      <p v-bind:class="{ 'css-info-header': hasRoomInfo }">Fénix WebApp</p>
      <div v-if="hasRoomInfo" class="css-room-info">
        <p>Currently checked in at <b>{{ displayRoom.name }}</b> &nbsp&nbsp</p>
        <p v-for="user in displayRoom.checkedInUsers">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspLogged in users: <span>{{ user.displayName }}</span></p>
        <p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspLast Message: {{ lastMessage }}</p>
      </div>
    </div>
    <div class="container">
      <router-view v-on:roomup="updateRoom" v-on:msgup="updateRoomMessages"></router-view>
    </div>
  </div>
</template>

<script>
  import { router } from './router.js';
  export default {
    data() {
      return { hasRoomInfo: false, displayRoom: {}, lastMessage: '' }
    },

    methods: {
      updateRoom: function(currentRoom) {
        this.displayRoom = currentRoom
        if(currentRoom){
          this.hasRoomInfo = true
          if(currentRoom.messages && !currentRoom.messages.length){
            this.lastMessage = 'No messages for this room...'
          } else {
            this.lastMessage = currentRoom.messages[currentRoom.messages.length-1].text;
          }
        } else {
          this.hasRoomInfo = false
        }
      },
      updateRoomMessages: function(messages) {
        this.displayRoom.messages = messages
        this.lastMessage = messages[messages.length-1].text;
      },
    },
    router,
  }
</script>

<style>
  body {
    background-color: #dfe8e5;
    overflow: hidden;
  }
  .main {
    width: 100%;
    height: 100%;
    text-align: center;
    overflow: hidden;
  }
  .header {
    position: absolute;
    width: 100%;
    height: 10%;
    text-align: center;
    background-color: #c3d1d5;
  }
  .header p {
    font-size: 1.5em;
    text-align: center;
  }
  .container {
    position: absolute;
    top: 10%;
    width: 80%;
    height: 88%;
    margin: 0px;
    padding: 2% 10% 0 10%;
    text-align: center;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .css-main-font {
    font-family: 'Open Sans', 'sans-serif';
  }
  .css-info-header {
    position: relative;
    float: left;
    display: inline-block;
    margin-top: 0.75%;
    margin-left: 2%;
    text-align: center;
    width: 20%;
    font-weight: bold;
  }
  .css-room-info {
    position: relative;
    display: inline-block;
    float: left;
    margin-top: 0.5%;
    margin-left: 10%;
    font-size: 0.55em;
    overflow-x: hidden;
  }
  .css-room-info p {
    display: inline-block;
  }
</style>
