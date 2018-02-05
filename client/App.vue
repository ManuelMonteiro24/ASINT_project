<template>
  <div class="main">
    <div class="header css-main-font">
      <p v-bind:class="{ 'css-info-header': hasRoomInfo }"><b>Fénix WebApp</b></p>
      <div v-if="hasRoomInfo" class="css-room-info">
        <p>Currently checked in at <b>{{ displayRoom.name }}</b></p>
        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
        <p><dropdown :align="'bottom'">
          <template slot="btn">Logged in users</template>
          <template slot="body">
            <ul>
              <li v-for="user in displayRoom.checkedInUsers">
                <p>{{ user.displayName }}, {{ user.username }}</p>
              </li>
            </ul>
          </template>
        </dropdown></p>
        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
        <p><dropdown :align="'bottom'">
          <template slot="btn">All Messages</template>
          <template slot="body">
            <p id="css-no-message-list" v-if="displayRoom.messages.length === 0">No messages for this room...</p>
            <ul v-else>
              <li v-for="msg in displayRoom.messages">
                <p>{{ msg.text }}</p>
              </li>
            </ul>
          </template>
        </dropdown></p>
        <p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<b>Last Message:</b> {{ lastMessage }}</p>
      </div>
    </div>
    <div class="container">
      <router-view v-on:roomup="updateRoom" v-on:msgup="updateRoomInfo"></router-view>
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
      updateRoomInfo: function(info) {
        this.displayRoom.messages = info.messages
        this.displayRoom.checkedInUsers = info.checkedInUsers
        if(info.messages.length !== 0) {
          this.lastMessage = info.messages[info.messages.length-1].text;
        }

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
  ul {
    padding-left: 5%;
    padding-right: 2%;
    font-size: 0.5em;
    list-style-type: none;
  }
  li {
    border-bottom-style: solid;
    border-bottom-width: 1px;
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
    font-size: 1.6em;
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
  .logged-in-users {
    overflow-x: hidden;
    max-width: 20em;
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
  }
  .css-room-info {
    position: relative;
    display: inline-block;
    float: left;
    margin-top: 0.5%;
    margin-left: 8%;
    font-size: 0.55em;
    overflow-x: hidden;
  }
  .css-room-info p {
    display: inline-block;
  }
  #css-no-message-list {
    font-size: 1em;
  }
</style>
