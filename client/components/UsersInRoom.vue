<template>
  <div class="main-div">
    <p><b>{{room.roomName}}</b></p>
    <input type="text" v-model="message">
    <button v-on:click="sendMessage">Send Message</button>
    <p v-if="messageReturn.success" >Success on sending message!</p>
    <p v-if="messageReturn.error">Error on sending message!</p>
    <p v-for="user in room.users"> {{ user.displayName }} {{ user.username }}</p>
  </div>
</template>

<script>
  export default {
    props: ['room'],
    data() {
      var message = []
      var messageReturn = { error: false, success: false }
      return { messageReturn, message };
    },
    created() {

    },

    methods: {
      resetMessages: function(){
        this.messageReturn.success = false;
        this.messageReturn.error = false;
      },
      sendMessage: function() {
        var bodyJ = {
          roomId: this.room.roomId,
          msg: this.message,
        }

        var options = {
          method: 'PUT',
          headers: new Headers({'Content-Type': 'application/json'}),
          credentials: 'same-origin',
          body: JSON.stringify(bodyJ),
        }

        var _this = this
        return fetch('/api/rooms/'+ this.room.roomId +'/messages', options).then(function(resp) {
          if(resp.ok) {
            _this.messageReturn.success = true
          } else if(resp.status === 401){
            _this.$emit('logout')
          } else {
            _this.messageReturn.error = true
          }
        }).catch( error => {
          _this.messageReturn.error = true
        }).finally(function() {
          setTimeout(_this.resetMessages, 3000);
        })

      }
    }
  }
</script>

<style>
  .main-div {
    padding-bottom: 1em;
    padding-top: 0.1%;
  }
</style>
