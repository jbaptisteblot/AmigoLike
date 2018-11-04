<template>
  <div class="home">
    <home-search></home-search>
  </div>
</template>

<script>
// @ is an alias to /src

import HomeSearch from "./HomeSearch";

export default {
  name: 'home',
  components: {
    HomeSearch
  }
}
</script>
