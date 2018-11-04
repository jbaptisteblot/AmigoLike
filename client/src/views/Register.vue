<template>
  <div>
    <h4>Login</h4>
    <form>
      <label for="email" >E-Mail Address</label>
      <div>
        <input id="email" type="email" v-model="email" class="form-control" required autofocus>
      </div>
      <div>
        <label for="password" >Password</label>
        <div>
          <input id="password" type="password" v-model="password" class="form-control" required>
        </div>
      </div><div>
        <label for="name" >Nom</label>
        <div>
          <input id="name" type="text" v-model="name" class="form-control" required>
        </div>
      </div><div>
        <label for="surname" >Prenom</label>
        <div>
          <input id="surname" type="text" v-model="surname" class="form-control" required>
        </div>
      </div>
      <div>
        <label for="phone" >phone</label>
        <div>
          <input id="phone" type="tel" v-model="phone" class="form-control" required>
        </div>
      </div>
      <div>
        <label for="username" >Username</label>
        <div>
          <input id="username" type="text" v-model="username" class="form-control" required>
        </div>
      </div>
      <div>
        <button type="submit" class="btn btn-outline-success" @click="handleSubmit">
          Register
        </button>
      </div>
    </form>
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

</style>
