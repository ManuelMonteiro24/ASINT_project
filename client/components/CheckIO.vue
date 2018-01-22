<template>
  <div>
    <p>{{ checkIO }}:</p>
    <p>User: {{ checkInfo.username }}  Room: {{ checkInfo.roomId }}</p>
  </div>
</template>

<script>
  export default {
    props: ['check-info'],
    created() {
      console.log(this.checkInfo)
    },
    methods: {
      checkIO: function() {
        console.log(this.checkInfo)
        var text = this.io? 'Check-In': 'Check-Out'
        return text;
      },
    }
  }
</script>
