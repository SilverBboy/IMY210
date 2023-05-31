<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <Fetch msg="Trying things"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Fetch from './components/Fetch.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Fetch,
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
