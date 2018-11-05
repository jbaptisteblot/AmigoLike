<template>
  <div>
    Bonjour {{userProfile.name}} {{userProfile.surname}} <br>
  </div>
</template>

<script>
    export default {
        name: "Profile",
        data() {
          return {
            userProfile: {}
          }
        },
      mounted:function() {
          this.loadProfile();
      },
      methods : {
        loadProfile() {
          this.$http.get("Utilisateurs/" + localStorage.getItem("userId")).then(response => {
            this.userProfile = response.data;
          }).catch(error => console.log(error))
        }
      }
    }
</script>

<style scoped>

</style>
