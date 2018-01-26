<template class="css-main-font">

  <div v-if="admin === true" class="css-main-font">
    <!--Admin Interface-->
    <input v-model="showCheckIOHist" v-on:click="showHistory" type="checkbox">
    <label>Show check in/out history</label>
    <input v-if="showCheckIOHist" type="button" v-on:click="showHistory" value="Refresh">
    <ul v-if="showCheckIOHist">
      <li v-for="item in checkIOHist">
        <p>{{ checkIO(item) }}: {{ item.username }}  &nbsp&nbsp Room: {{ item.roomID }}</p>
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
    <div v-if="!loadingSearch && !noResults" class="scrollable">
      <ul>
        <li v-for="room in rooms"><room v-bind:info="room"></room></li>
      </ul>
    </div>
    <h3 v-else-if="!loadingSearch">No Results Found :/</h3>
  </div>

</template>

<script>
  var _ = require('underscore')
  export default {

    props: ['admin'],

    data() {
      return { showCheckIOHist: false, checkIOHist: [], search: '', loadingSearch: false, noResults: false, rooms: [], check: []};
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
      showRoom: function() {
        var _this = this
        this.loadingSearch = true
        return this.fetchRoom().then(function(data) {
          if(typeof data !== 'number') {
            _this.$data.rooms = data;
            _this.loadingSearch = false
            if(!data.length) {
              _this.noResults = true
            }
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
      }
    },

    watch: {
      search: function(nw, old) {
        if(nw === '') {
          this.$data.noResults = false
        }
      },
    }
  }
</script>

<style scoped>
  li {
    background-color: white;
    margin-bottom: 10px;
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
</style>
