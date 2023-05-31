<template>
  <apiCalls msg="Trying things"/>
</template>

<script>
import apiCalls from './components/apiCalls.vue'

export default {
  name: 'App',
  components: {
    apiCalls,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
