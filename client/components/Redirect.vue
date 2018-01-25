<template>
  <p class="css-main-font">You will be redirected shortly...</p>
</template>

<script>
  export default {
    props: ['redirectLink'],
    created() {
      window.location = this.redirectLink; //redirect client to @redirectLink
    },
  }
</script>
