<template>
  <div class="list-item">
    <div class="prg">
      <p class="p1">Space: {{ info.description }} --> <span v-if="info.parentSpace.type==='FLOOR'">Floor</span> {{ info.parentSpace.name }}, {{ info.topLevelSpace.name }}</p>
      <p class="p2">ExamCapacity: {{ info.capacity.exam }}&nbsp&nbsp NormalCapacity: {{ info.capacity.normal }}</p>
      <p class="p3">{{ info.events.length }} scheduled events</p>
    </div>
    <button v-on:click="checkIn"><span v-if="!checkedIn">Check In</span><span v-else>CheckOut</span></button>
  </div>
</template>

<script>
  export default {

    props: ['info', 'rid'],

    data() {
      return { }
    },

    computed: {
      checkedIn: function() {
        return this.info.id === this.rid
      },
    },
    methods: {
      checkIn: function() {
        var bodyJ = {
          roomId: this.info.id,
          roomName: this.info.description,
          username: this.$parent.$parent.profile.username,
          displayName: this.$parent.$parent.profile.displayName,
        }

        var options = {
          method: 'POST',
          headers: new Headers({'Content-Type': 'application/json'}),
          credentials: 'same-origin',
          body: JSON.stringify(bodyJ),
        }

        if(this.checkedIn) {
          var _this = this
          return fetch('/api/checkio/out', options).then(function(resp) {
            if(resp.ok) {
              _this.$emit('roomup', 0, undefined)
            }
          }).catch( error => { throw error; })
        }

        var _this = this
        return fetch('/api/checkio/in', options).then(function(resp) {
          if(resp.ok) {
            return resp.json()
          }
        }).then(function(room) {
          _this.$emit('roomup', room._id, room)
        }).catch( error => { throw error; })

      },
      resetCheckStatus: function() {
        if(this.checkedIn) {
          this.checkedIn = false;
        }
      },

    },
  }
</script>

<style scoped>
 .prg {
   position: relative;
   width: 60%;
   padding-left: 2%;
   font-size: 15px;
   text-align: left;
   display: inline-block;
   right: 20%;
 }
 button {
   display: inline-block;
   position: relative;
   float: right;
   top: 1em;
   right: 10%;
   width: 7em;
 }
 .p2 {
   position: relative;
   margin-top: 4%;
 }
 p {
   position: relative;
   margin-top: 1%;
   margin-bottom: 0;
 }
 .list-item {
   position: relative;
   padding-top: 5px;
   padding-bottom: 5px;
 }

</style>
