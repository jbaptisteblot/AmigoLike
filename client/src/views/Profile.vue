<template>
  <div class="col-md-8">
    <div v-if="this.errorMsg.length !== 0"  class="alert alert-danger">
      {{errorMsg}}
    </div>
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
      <div class="tab-pane fade show active" id="general" role="tabpanel" aria-labelledby="general-tab">
        <div class="form-group">
          <label for="email" >E-Mail Address</label>
          <input id="email" type="email" v-model="userProfile.email" class="form-control" required autofocus>
        </div>
        <div class="form-group">
          <label for="name" >Prenom</label>
          <input id="name" type="text" v-model="userProfile.name" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="surname" >Nom</label>
          <input id="surname" type="text" v-model="userProfile.surname" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="phone" >Téléphone</label>
          <input id="phone" type="tel" v-model="userProfile.phone" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="username" >Username</label>
          <input id="username" type="text" v-model="userProfile.username" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-outline-success" @click="updateProfil">
          Mise à jour
        </button>
      </div>
      <div class="tab-pane fade" id="reservations" role="tabpanel" aria-labelledby="reservations-tab">...</div>
      <div class="tab-pane fade" id="preference" role="tabpanel" aria-labelledby="preference-tab">
        <div class="form-group">
          <label for="vehiculeType" >Votre type de véhicule</label>
          <input id="vehiculeType" type="text" v-model="userProfile.preferencesVoyageurs.vehiculeType" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="vehiculeAge" >Année de votre véhicule</label>
          <input id="vehiculeAge" type="text" v-model="userProfile.preferencesVoyageurs.vehiculeAge" class="form-control" required>
        </div>
        <div class="form-group">
          <div class="form-check">
            <label for="luggageSpace" >Espace pour vos bagages</label>
            <input id="luggageSpace" type="text" v-model="userProfile.preferencesVoyageurs.luggageSpace" class="form-control" required>
          </div>
        </div>
        <div class="form-group">
          <div class="form-check">
            <label class="form-check-label" for="smoking" >Fumer</label>
            <input id="smoking" type="checkbox" v-model="userProfile.preferencesVoyageurs.smoking" class="form-check-input" required>
          </div>
        </div>
        <div class="form-group">
          <div class="form-check">
            <label class="form-check-label" for="phoneAccess" >Autoriser l'accès au téléphone</label>
            <input id="phoneAccess" type="checkbox" v-model="userProfile.preferencesVoyageurs.phoneAccess" class="form-check-input" required>
          </div>
        </div>
        <div class="form-group">
          <div class="form-check">
            <label class="form-check-label" for="emailAccess" >Access à l'email</label>
            <input id="emailAccess" type="checkbox" v-model="userProfile.preferencesVoyageurs.emailAccess" class="form-check-input" required>
          </div>
        </div>
        <div class="form-group">
          <div class="form-check">
            <label class="form-check-label" for="climatisation" >Climatisation</label>
            <input id="climatisation" type="checkbox" v-model="userProfile.preferencesVoyageurs.climatisation" class="form-check-input" required>
          </div>
        </div>
        <button type="submit" class="btn btn-outline-success" @click="updatePreferences">
          Mise à jour
        </button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Profile",
        data() {
          return {
            errorMsg: "",
            userProfile: {}
          }
        },
      mounted:function() {
          this.loadProfile();
      },
      methods : {
        loadProfile() {
          this.$http.get("Utilisateurs/" + localStorage.getItem("userId"), {
            params: {
              filter: {include: "preferencesVoyageurs"}
            }
          }).then(response => {
            this.userProfile = response.data;
          }).catch(error => console.log(error))
        },
        updateProfil() {
          this.$http.put('Utilisateurs', {
            email: this.userProfile.email,
            name: this.userProfile.name,
            surname : this.userProfile.surname,
            phone: this.userProfile.phone,
            username: this.userProfile.username,
            id: this.userProfile.id
          })
        },
        updatePreferences() {
          this.$http.put('PreferencesVoyageurs', {
            utilisateurId: this.userProfile.id,
            id: this.userProfile.preferencesVoyageurs.id,
            smoking: this.userProfile.preferencesVoyageurs.smoking,
            phoneAccess: this.userProfile.preferencesVoyageurs.phoneAccess,
            emailAccess: this.userProfile.preferencesVoyageurs.emailAccess,
            climatisation: this.userProfile.preferencesVoyageurs.climatisation,
            luggageSpace: this.userProfile.preferencesVoyageurs.luggageSpace,
            vehiculeType: this.userProfile.preferencesVoyageurs.vehiculeType,
            vehiculeAge: this.userProfile.preferencesVoyageurs.vehiculeAge
          }).then(() => {
            this.errorMsg = "Paramètres mis à jour."
          }).catch(err => {
            this.errorMsg = err;
          })
        }
      }
    }
</script>

<style scoped>

</style>
