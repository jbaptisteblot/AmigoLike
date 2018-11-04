<template>
  <ul class="navbar-nav ml-3 mr-1" v-if="!userlogged">
    <li class="nav-item">
      <router-link to="/login" class="nav-link">Login</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/register" class="nav-link">Register</router-link>
    </li>
  </ul>
  <ul class="navbar-nav ml-3 mr-1" v-else-if="userlogged">
    <li class="nav-item">
      <router-link to="/logout" class="nav-link">Se déconnecter</router-link>
    </li>
  </ul>
</template>

<script>
    export default {
        name: "loginMenu",
        props: ['userlogged']
    }
</script>

<style scoped>

</style>
