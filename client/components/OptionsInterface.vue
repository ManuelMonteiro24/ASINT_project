<template>

  <div v-if="admin">
    <input type="checkbox" v-on:click="showHistory"><label>Show check in/out history</label></input>
    <ul v-if="showCheckIOHist">
      <li v-for="info in checkIOHist">
        <p>{{ checkIO }}:</p>
        <p>User: {{ checkInfo.username }}  Room: {{ checkInfo.roomId }}</p>
      </li>
    </ul>
  </div>

  <div v-else>
    <!--User Interface-->
  </div>

</template>

<script>
  export default {
    props: ['admin'],
    data() {
      return { showCheckIOHist: false, checkIOHist: [] };
    },
    methods: {
      showHistory: function() {
        if(this.showCheckIOHist) {
          this.$data.showCheckIOHist = false
          return
        }

        var _this = this
        return this.fetchHistory().then(function(data) {
          _this.$data.checkIOHist = data;
          _this.$data.showCheckIOHist = true
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
    },
  }
</script>
