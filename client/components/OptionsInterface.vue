<template>

  <div v-if="admin === true">
    <input type="checkbox" v-on:click="showHistory"><label>Show check in/out history</label></input>
    <ul v-if="showCheckIOHist">
      <li v-for="item in checkIOHist">
        <p>{{ checkIO(item) }}: {{ item.username }}  Room: {{ item.roomID }}</p>
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
          if(data) {
            _this.$data.checkIOHist = data  ;
            _this.$data.showCheckIOHist = true
          } else {
            _this.$emit('render')
          }
        })
      },
      fetchHistory: function() {
        return fetch('/api/checkio/history', { credentials: 'same-origin' }).then(function(resp) {
          if(resp.ok) {
            return resp.json()
          }
          return undefined
        }).catch(err => { throw err; });
      },
      checkIO: function(item) {
        var text = item.io? 'Check-In': 'Check-Out'
        return text;
      },
    },
  }
</script>

<style scoped>
  li {
    background-color: white;
  }
</style>
