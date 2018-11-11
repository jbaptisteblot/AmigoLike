<template>
    <div class="">
      <h1>Bienvenue sur votre site de covoiturage, merci de rechercher votre trajet</h1>
      <div class="form-group">
        <label for="villeDepart">Ville départ</label>
        <input type="text" name="villeDepart" id="villeDepart" class="form-control" placeholder="Ville départ" v-model="villeDepart">
      </div>
      <div class="form-group">
        <label for="villeArrive">Ville arrivée</label>
        <input type="text" name="villeArrive" id="villeArrive" class="form-control" placeholder="Ville arrivée" v-model="villeArrive">
      </div>
      <div class="form-group">
        <label for="dateDepart">Date départ</label>
        <input type="date" name="date Depart" id="dateDepart" class="form-control" :min="today" v-model="dateDepart">
      </div>
      <input type="submit" class="btn btn-outline-success" v-on:click="search" />
    </div>
</template>

<script>
    export default {
        name: "HomeSearch",
        data() {
          return {
            villeDepart : "",
            villeArrive : "",
            dateDepart: ""
          }
        },
        methods : {
          search() {
            this.$router.push({name: 'search', params: {villeDepart: this.villeDepart, villeArrive: this.villeArrive, dateDepart: this.dateDepart}})
          }
        },
      computed: {
          today: () => {
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth()+1;
            if(dd<10){
              dd='0'+dd
            }
            if(mm<10){
              mm='0'+mm
            }
            return today.getFullYear() +'-'+mm+'-'+dd;
          }
      }
    }
</script>

<style scoped>

</style>
