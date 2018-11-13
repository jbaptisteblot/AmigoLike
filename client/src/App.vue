<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/" class="navbar-brand">AmigoLike</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link to="/" class="nav-link" >Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link">Profile</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/myTravels" class="nav-link">Mes voyages créés</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/myReservations" class="nav-link">Mes réservations</router-link>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
        <login-menu v-bind:userlogged="userlogged"></login-menu>
      </div>
    </nav>
    <div class="container mt-3">
      <router-view v-on:user-logged="userLogged"/>
    </div>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}
</style>
<script>
  import LoginMenu from "./components/loginMenu";
  export default {
    components: {LoginMenu},
    data() {
      return {
        userlogged: false
      }
    },
    methods : {
      userLogged(loggedUserBool) {
        this.userlogged = loggedUserBool;
      },
      clearLocalStorage() {
        localStorage.removeItem("userId");
        localStorage.removeItem("accessId");
      }
    },
    created() {
      // On vérifie les accés de la personne à l'application
      if(localStorage.getItem("accessId") !== null || localStorage.getItem("userId")) {
        this.$http.get("Utilisateurs/" + localStorage.getItem("userId")).then(() => {
          this.userlogged = true;
        }).catch(() => {
          this.clearLocalStorage();
          this.userlogged = false;
        })
      } else {
        this.userlogged = false;
        this.clearLocalStorage();
      }
    }
  }
</script>
