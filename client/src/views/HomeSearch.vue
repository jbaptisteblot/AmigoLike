<template>
    <div class="">
      <h1>Bienvenue sur votre site de covoiturage, merci de rechercher votre trajet</h1>
      <div class="form-group">
        <label for="villeDepart">Ville départ</label>
        <input type="text" name="villeDepart" id="villeDepart" class="form-control" placeholder="Ville départ" v-model="villeDepart">
      </div>
      <div class="form-group">
        <label for="villeArrive">Ville arrivée</label>
        <input type="text" name="villeDepart" id="villeArrive" class="form-control" placeholder="Ville arrivée" v-model="villeArrive">
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
            villeArrive : ""
          }
        },
        methods : {
          search() {
            this.$router.push({name: 'search', params: {villeDepart: this.villeDepart, villeArrive: this.villeArrive}})
          }
        }
    }
</script>

<style scoped>

</style>
