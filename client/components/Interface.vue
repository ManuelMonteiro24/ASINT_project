a<template class="css-main-font">

  <div v-if="admin === true" class="css-main-font">
    <!--Admin Interface-->
    <input v-model="adminState.showCheckIOHist" type="checkbox">
    <label>Show check in/out history</label>
    <ul v-if="adminState.showCheckIOHist" class="list-scroll">
      <li v-for="item in adminState.checkIOHist">
        <p><b>{{ checkIO(item) }}:&nbsp</b> {{ item.username }}, {{ item.roomName }} at <span style="text-decoration:underline">{{ date(item) }}</span></p>
      </li>
    </ul>
    <p>Currently checked in users: <span v-if="adminState.checkedInUsers.length === 0">None</span></p>
    <ul v-if="adminState.checkedInUsers.length !== 0" class="list-scroll">
      <li v-for="room in adminState.checkedInUsers">
        <users v-on:logout="reemitLogout" v-bind:room="room"></users>
      </li>
    </ul>
  </div>

  <div v-else class="css-main-font css-user">
    <!--User Interface-->
    <p>Search for a room within Instituto Superior Técnico</p>
    <form v-on:submit.prevent="showRoom">
      <input v-model="userState.search" type="text">
      <input v-on:click="clearSearch" v-if="!userState.loadingSearch && !userState.noResults" type="button" value="Clear Search">
    </form>
    <h3 v-if="userState.loadingSearch">Loading Search Results...</h3>
    <div v-if="!userState.loadingSearch && !userState.noResults">
      <ul>
        <li v-for="ritem in userState.displayRooms"><room v-bind:info="ritem" v-bind:rid="userState.checkedInRoom" v-on:roomup="reemitRoomUp"></room></li>
      </ul>
      <button v-if="(userState.rooms.length > 5) && userState.resPage > 0" v-on:click="userState.resPage--" class="prev-btn"><<<</button>
      <button v-if="(userState.rooms.length > 5) && (userState.resPage < parseInt(userState.rooms.length/5))" v-on:click="userState.resPage++" class="next-btn">>>></button>
    </div>
    <h3 v-else-if="!userState.loadingSearch">No Results Found :/</h3>
  </div>

</template>

<script>
  var _ = require('underscore')
  export default {

    props: ['admin', 'subscription'],

    data() {
      var adminState = { showCheckIOHist: false, checkIOHist: [], checkedInUsers: [] }
      var userState = { search: '', loadingSearch: false, noResults: false, resPage: 0, rooms: [], displayRooms: [], checkedInRoom: 0, interval:{} }
      return { adminState, userState, sint: undefined };
    },

    created() {
      if(this.admin){
        this.fetchCheckedInUsers()
        this.sint = setInterval(this.fetchCheckedInUsers, 5000);
      } else {
        if(this.$parent.$parent.hasRoomInfo) {
          this.userState.checkedInRoom = this.subscription
          this.sint = setInterval(this.updateMessages, 5000);
        }
      }

    },

   destroyed() {
     clearInterval(this.sint)
     clearInterval(this.userState.interval)
   },

    methods: {
      showHistory: function() {
        var _this = this
        return this.fetchHistory().then(function(data) {
          if(typeof data !== 'number') {
            _this.$data.adminState.checkIOHist = data;
          } else if (data === 401){
            _this.$emit('logout')
          }
        })
      },
      fetchHistory: function() {
        return fetch('/api/checkio/history', { credentials: 'same-origin' }).then(function(resp) {
          if(resp.ok) {
            return resp.json()
          }
          return resp.status
        }).catch(err => { throw err; });
      },
      checkIO: function(item) {
        var text = item.io? 'Check-In': 'Check-Out'
        return text;
      },
      date: function(item) {
        return (new Date(item.timestamp)).toUTCString()
      },
      showRoom: function() {
        var _this = this
        this.userState.loadingSearch = true
        return this.fetchRoom().then(function(data) {
          if(typeof data !== 'number') {
            _this.$data.userState.rooms = data;
            _this.$data.userState.displayRooms = data.slice(0, (5 > data.length)? data.length:5 )
            _this.userState.loadingSearch = false
            _this.userState.noResults = !data.length? true:false
          } else if (data === 401){
            _this.$emit('logout')
          }
        })
      },
      fetchRoom: function() {
        //TODO search params
        var params = { search: this.userState.search }
        var url = new URL('http://35.195.212.225/api/rooms/find')
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

        return fetch(url, { credentials: 'same-origin' }).then(function(resp) {
          if(resp.ok) {
            return resp.json();
          }
          return resp.status;
        }).catch(err => { throw err; })
      },
      fetchCheckedInUsers: function() {
        var _this = this;
        return fetch('/api/rooms/users', { credentials: 'same-origin' }).then(function(resp) {
          if(resp.ok) {
            return resp.json()
          }
          return resp.status
        }).then(function(body){
          if(typeof body !== 'number') {
            if(body.info.length !== 0){
              _this.adminState.checkedInUsers = body.info
            } else {
              _this.adminState.checkedInUsers = []
            }
          } else if (body === 401){
            _this.$emit('logout')
          }

        }).catch(err => { console.log(err)});
      },
      clearSearch: function() {
        this.$data.userState.rooms = []
        this.$data.userState.displayRooms = []
      },
      updateMessages: function() {
        var options = {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            credentials: 'same-origin',
            body: JSON.stringify({
              username: this.$parent.profile.username,
              displayName: this.$parent.profile.displayName,
            }),
        }

        var _this = this
        return fetch('/api/rooms/'+ this.userState.checkedInRoom +'/messages', options ).then(function(resp) {
          if(resp.ok) {
            return resp.json()
          }
          return resp.status
        }).then(function(body){
          if(typeof body !== 'number') {
            if(body.messages.length !== 0 || body.checkedInUsers.length !== 0){
              _this.$emit('msgup', body)
            }
          } else if (body === 401){
            _this.$emit('logout')
          }

        }).catch(err => { console.log(err)});
      },
      reemitRoomUp: function(id, arg) {
        this.$emit('roomup', arg)
        this.userState.checkedInRoom = id
        if(id !== 0) {
          this.sint = setInterval(this.updateMessages, 5000);
        } else {
          clearInterval(this.sint)
        }
      },
      reemitLogout: function() {
        this.$emit('logout')
      }
    },

    watch: {
      'userState.search': function(nw, old) {
        if(nw === '') {
          this.$data.userState.noResults = false
        }
      },
      'userState.resPage': function(nw, old) {
        var begin = 5*nw, end = begin + 5
        var pages = parseInt(this.userState.rooms.length/5)
        if(nw === pages){
          if(begin-this.userState.rooms.length !== 0) {
            end = this.userState.rooms.length
          }
        }
        this.$data.userState.displayRooms = this.$data.userState.rooms.slice(begin, end)
      },
      'userState.loadingSearch': function(nw, old) {
        this.userState.resPage = 0;
      },
      'adminState.showCheckIOHist': function(nw, old) {
        if(nw) {
          this.showHistory(); //call function and set interval
          this.userState.interval = setInterval(this.showHistory, 5000)
        } else {
          clearInterval(this.userState.interval)
          this.userState.interval = undefined;
        }
      },
    }
  }
</script>

<style scoped>
  ul {
    list-style-type: none;
    position: relative;
    padding-left: 20%;
    padding-right: 20%;

  }
  li {
    position: relative;
    background-color: white;
    margin-bottom: 10px;
    padding-left: 10%;
    border-radius: 5px;
  }
  form {
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .list-scroll {
    max-height: 20em;
    overflow-y: scroll;
  }
  .css-user {
    position: relative;
    margin-top: 30px;
  }
  .css-user p {
    font-size: 15px;
  }
  .prev-btn {
    position: relative;
    float: center;
    right: 10%;
    width: 7em;
  }
  .next-btn {
    position: relative;
    float: center;
    left: 10%;
    width: 7em;
  }
</style>
