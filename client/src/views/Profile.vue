<template>
  <div class="col-md-8">
    <h2>Bienvenue sur votre profil {{userProfile.name}} {{userProfile.surname}}</h2>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="general-tab" data-toggle="tab" href="#general" role="tab" aria-controls="general" aria-selected="true">General</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="reservations-tab" data-toggle="tab" href="#reservations" role="tab" aria-controls="reservations" aria-selected="false">Vos réservations</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="preference-tab" data-toggle="tab" href="#preference" role="tab" aria-controls="preference" aria-selected="false">Préférences de voyage</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="general" role="tabpanel" aria-labelledby="general-tab">...</div>
      <div class="tab-pane fade" id="reservations" role="tabpanel" aria-labelledby="reservations-tab">...</div>
      <div class="tab-pane fade" id="preference" role="tabpanel" aria-labelledby="preference-tab">...</div>
    </div>
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
