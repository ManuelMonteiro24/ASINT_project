<template class="css-main-font">

  <div v-if="admin === true" class="css-main-font">
    <input v-model="showCheckIOHist" v-on:click="showHistory" type="checkbox">
    <label>Show check in/out history</label>
    <input v-if="showCheckIOHist" type="button" v-on:click="showHistory" value="Refresh"></input>
    <ul v-if="showCheckIOHist">
      <li v-for="item in checkIOHist">
        <p>{{ checkIO(item) }}: {{ item.username }}  Room: {{ item.roomID }}</p>
      </li>
    </ul>
  </div>

  <div v-else class="css-main-font">
    <!--User Interface-->
    <label>Search for a room within Instituto Superior Técnico</label>
    <form v-on:submit.prevent="showRoom">
      <input v-model="check[0]" type="checkbox" id="r1">
      <label for="r1">Alameda</label>
      <input v-model="check[1]" type="checkbox" id="r2">
      <label for="r2">Núcleo de Física Tecnológica e Nuclear</label>
      <input v-model="check[2]" type="checkbox" id="r3">
      <label for="r3">Taguspark</label><br>
      <input v-model="roomIn" type="text">
    </form>
  </div>

</template>

<script>
  var _ = require('underscore')
  export default {
    props: ['admin'],
    data() {
      return { showCheckIOHist: false, checkIOHist: [], roomIn: '', rooms: [],  check: []};
    },
    methods: {
      showHistory: function() {
        if(this.showCheckIOHist) { return }

        var _this = this
        return this.fetchHistory().then(function(data) {
          if(typeof data !== 'number') {
            _this.$data.checkIOHist = data  ;
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
        console.log(this.roomIn)
        return this.fetchRoom().then(function(data) {
          if(typeof data !== 'number') {
            _this.$data.rooms = data  ;
          } else if (data === 401){
            _this.$emit('render')
          }
        })
      },
      fetchRoom: function() {
        //TODO search params
        var params = { search: this.roomIn }
        var url = new URL('http://localhost:3000/api/rooms/find')
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

        return fetch(url, { credentials: 'same-origin' }).then(function(resp) {
          if(resp.ok) {
            return resp.json();
          }
          return resp.status;
        }).catch(err => { throw err; })
      },
    },
  }
</script>

<style scoped>
  li {
    background-color: white;
  }
  input[type="text"] {
    position: relative;
    margin-top: 15px;
  }
  form {
    position: relative;
    margin-top: 20px;
  }
</style>
