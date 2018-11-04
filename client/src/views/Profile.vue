<template>
  <div>
    Bonjour {{userProfile.username}}
    Vos prochaines réservations :

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
          this.$http.get("Utilisateurs/" + localStorage.getItem("userId"),
             {
            firstName: 'Fred',
              lastName: 'Flintstone'
          }).then(response => {
            this.userProfile = response.data;
          }).catch(error => console.log(error))
        }
      }
    }
</script>

<style scoped>

</style>
