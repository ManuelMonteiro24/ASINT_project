<template>
  <div class="list-item">
    <p class="p1">Space: {{ info.description }} --> <span v-if="info.parentSpace.type==='FLOOR'">Floor</span> {{ info.parentSpace.name }}, {{ info.topLevelSpace.name }}</p>
    <p class="p2">ExamCapacity: {{ info.capacity.exam }}&nbspNormalCapacity: {{ info.capacity.exam }}</p>
    <p class="p3">{{ info.events.length }} scheduled events</p>
    <button v-on:click="checkUser" >check</button>
  </div>
</template>

<script>
  export default {
    props: ['info'],
    created() {
      console.log(this.info)
    },
    methods: {
      checkUser: function() {
        // TODO this.$router.push({name: 'adminlogin'});
      }
    }
}
</script>

<style scoped>
 p {
   padding-left: 2%;
   font-size: 15px;
   text-align: left;
 }
 .p1 {
   position: relative;
   margin-top: 2%;
 }
 .p2 {
   position: relative;
   margin-top: 1%;
   margin-bottom: 0;
 }
 .p3 {
   position: relative;
   margin-top: 1%;
   margin-bottom: ;
 }
 .list-item {
   padding-top: 5px;
   padding-bottom: 5px;
 }
</style>
