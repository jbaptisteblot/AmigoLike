<template>
  <div class="row pt-3 justify-content-center ">
    <div class="col-md-7 p-0 register-form">
      <form class="p-3">
        <h4>Inscription</h4>
        Inscrivez vous dès maintenant !

        <div class="form-group">
          <label for="email" >E-Mail Address</label>
          <input id="email" type="email" v-model="email" class="form-control" required autofocus>
        </div>
          <div class="form-group">
            <label for="password" >Mot de passe</label>
            <input id="password" type="password" v-model="password" class="form-control" required>
          </div>
        <div class="form-group">
          <label for="name" >Prenom</label>
          <input id="name" type="text" v-model="name" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="surname" >Nom</label>
            <input id="surname" type="text" v-model="surname" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="phone" >Téléphone</label>
            <input id="phone" type="tel" v-model="phone" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="username" >Username</label>
            <input id="username" type="text" v-model="username" class="form-control" required>
           </div>
          <button type="submit" class="btn btn-outline-success" @click="handleSubmit">
            Register
          </button>
      </form>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Register",
      data() {
          return {
            name : "",
            surname: "",
            phone :"",
            email : "",
            password : "",
            username : ""
          }
      },
      methods : {
        handleSubmit(e){
          e.preventDefault();
          if (this.password.length > 0) {
            this.$http.post('http://localhost:3000/api/Utilisateurs', {
              email: this.email,
              password: this.password,
              name: this.name,
              surname : this.surname,
              phone: this.phone,
              username: this.username
            })
              .then(() => {
                this.$router.push("login");
              })
              .catch(function (error) {
                console.error(error.response);
              });
          }
        }
      }
    }
</script>

<style scoped>
  .register-form {
    -webkit-box-shadow: 0 17px 60px 0 rgba(0,0,0,0.3);
    box-shadow: 0 17px 60px 0 rgba(0,0,0,0.3);
    -webkit-border-radius: 10px 10px 10px 10px;
    border-radius: 10px 10px 10px 10px;
  }
</style>
