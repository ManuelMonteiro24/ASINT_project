<template class="css-main-font">

  <div v-if="admin === true" class="css-main-font">
    <!--Admin Interface-->
    <input v-model="showCheckIOHist" v-on:click="showHistory" type="checkbox">
    <label>Show check in/out history</label>
    <input v-if="showCheckIOHist" type="button" v-on:click="showHistory" value="Refresh">
    <ul v-if="showCheckIOHist">
      <li v-for="item in checkIOHist">
        <p>{{ checkIO(item) }}: {{ item.username }}  has checked out from {{ item.roomName }} at {{ date(item) }}</p>
      </li>
    </ul>
  </div>

  <div v-else class="css-main-font css-user">
    <!--User Interface-->
    <p>Search for a room within Instituto Superior Técnico</p>
    <form v-on:submit.prevent="showRoom">
      <input v-model="search" type="text">
      <input v-on:click="clearSearch" v-if="!loadingSearch && !noResults" type="button" value="Clear Search">
    </form>
    <h3 v-if="loadingSearch">Loading Search Results...</h3>
    <div v-if="!loadingSearch && !noResults">
      <ul>
        <li v-for="room in displayRooms"><room v-bind:info="room" v-bind:rid="checkedInRoom" v-on:roomup="reemit"></room></li>
      </ul>
      <button v-if="(rooms.length > 5) && resPage > 0" v-on:click="resPage--" class="prev-btn"><<<</button>
      <button v-if="(rooms.length > 5) && (resPage < parseInt(this.$data.rooms.length/5))" v-on:click="resPage++" class="next-btn">>>></button>
    </div>
    <h3 v-else-if="!loadingSearch">No Results Found :/</h3>
  </div>

</template>

<script>
  var _ = require('underscore')
  export default {

    props: ['admin', 'subscription'],

    data() {
      return { showCheckIOHist: false, checkIOHist: [], search: '', loadingSearch: false, noResults: false, resPage: 0, rooms: [], displayRooms: [], checkedInRoom: 0 };
    },

    created() {
      if(this.$parent.$parent.hasRoomInfo) {
        this.checkedInRoom = this.subscription
      }
    },

    methods: {
      showHistory: function() {
        if(this.showCheckIOHist) { return }

        var _this = this
        return this.fetchHistory().then(function(data) {
          if(typeof data !== 'number') {
            _this.$data.checkIOHist = data;
          } else if (data === 401){
            _this.$emit('render')
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
        this.loadingSearch = true
        return this.fetchRoom().then(function(data) {
          if(typeof data !== 'number') {
            _this.$data.rooms = data;
            _this.$data.displayRooms = data.slice(0, (5 > data.length)? data.length:5 )
            _this.loadingSearch = false
            _this.noResults = !data.length? true:false
          } else if (data === 401){
            _this.$emit('render')
          }
        })
      },
      fetchRoom: function() {
        //TODO search params
        var params = { search: this.search }
        var url = new URL('http://localhost:3000/api/rooms/find')
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

        return fetch(url, { credentials: 'same-origin' }).then(function(resp) {
          if(resp.ok) {
            return resp.json();
          }
          return resp.status;
        }).catch(err => { throw err; })
      },
      clearSearch: function() {
        this.$data.rooms = []
        this.$data.displayRooms = []
      },
      reemit: function(id, arg) {
        this.$emit('roomup', arg)
        this.checkedInRoom = id
      }
    },

    watch: {
      search: function(nw, old) {
        if(nw === '') {
          this.$data.noResults = false
        }
      },
      resPage: function(nw, old) {
        var begin = 5*nw, end = begin + 5
        var pages = this.rooms.length/5
        if(nw === pages){
          if(begin-this.rooms.length !== 0) {
            end = this.rooms.length
          } else {
            return
          }
        }
        this.$data.displayRooms = this.$data.rooms.slice(begin, end)
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
