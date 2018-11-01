<template>
  <div>
    <div v-if="this.errorMsg.length !== 0"  class="alert alert-danger">
      {{errorMsg}}
    </div>
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
      </div>
      <div>
        <button type="submit" class="btn btn-outline-success" @click="handleSubmit">
          Login
        </button>
      </div>
    </form>
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

</style>
