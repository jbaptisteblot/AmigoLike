<template>
  <div class="row pt-5 justify-content-center ">
    <div class="col-md-5 p-0 login-form">
      <form class="p-3">
        <div v-if="this.errorMsg.length !== 0"  class="alert alert-danger">
          {{errorMsg}}
        </div>
        <h4>Connectez vous dès maintenant !</h4>
        <div class="form-group">
          <label for="email" >E-Mail Address</label>
          <input id="email" type="email" v-model="email" class="form-control" required autofocus>
        </div>
        <div class="form-group">
          <label for="password" >Password</label>
          <input id="password" type="password" v-model="password" class="form-control" required>
        </div>
          <button type="submit" class="btn btn-outline-success" @click="handleSubmit">
            Login
          </button>
      </form>
      <div class="login-footer mt-2">
        Pas de compte ? <br>
        <router-link to="/register" class="nav-link">S'inscrire</router-link>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
          return {
            email: "",
            password : "",
            errorMsg : ""
          }
        },
      methods : {
        handleSubmit(e){
          e.preventDefault();
          if (this.password.length > 0) {
            this.$http.post('Utilisateurs/login', {
              email: this.email,
              password: this.password
            })
              .then(response => {
                localStorage.setItem("accessId", response.data.id);
                localStorage.setItem("userId", response.data.userId);
                this.$emit('user-logged', true);
                this.$router.push("/");
              })
              .catch(() => {
                  this.errorMsg = "Une erreur s'est produite. Merci de vérifier vos informations.";
              });
          }
        }
      }
    }
</script>

<style scoped>
  .login-form {
    -webkit-box-shadow: 0 17px 60px 0 rgba(0,0,0,0.3);
    box-shadow: 0 17px 60px 0 rgba(0,0,0,0.3);
    -webkit-border-radius: 10px 10px 10px 10px;
    border-radius: 10px 10px 10px 10px;
  }
  .login-footer {
    background-color: #f6f6f6;
    border-top: 1px solid #dce8f1;
    border-radius: 0 0 10px 10px;
  }
</style>
