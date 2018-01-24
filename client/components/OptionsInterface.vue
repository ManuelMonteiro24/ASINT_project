<template>

  <div v-if="admin === true">
    <input type="checkbox" v-model="showCheckIOHist" v-on:click="showHistory"><label>Show check in/out history</label></input>
    <input v-if="showCheckIOHist" type="button" v-on:click="showHistory" value="Refresh"></input>
    <ul v-if="showCheckIOHist">
      <li v-for="item in checkIOHist">
        <p>{{ checkIO(item) }}: {{ item.username }}  Room: {{ item.roomID }}</p>
      </li>
    </ul>
  </div>

  <div v-else>
    <!--User Interface-->
    <form v-on:submit.prevent="showRoom">
      <label>Search for a room within Instituto Superior Técnico</label>
      <input v-model="roomIn" type="text">
      <p>{{ roomIn }}</p>
    </form>
  </div>



</template>

<script>
  export default {
    props: ['admin'],
    data() {
      return { showCheckIOHist: false, checkIOHist: [], roomIn: '', searchRooms: [] };
    },
    methods: {
      showHistory: function() {
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
        this.fetchRoom(this.roomIn).then(function(data) {
          if(typeof data !== 'number') {
            _this.$data.checkIOHist = data  ;
          } else if (data === 401){
            _this.$emit('render')
          }
        })
      },
      fetchRoom: function(search) {
        //TODO search params
        fetch('/api/room/find', { credentials: 'same-origin' }).then(function(resp) {
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
</style>
