<template>
    <div>
      <h1>Vos résultats de recherche</h1>
      <div class="card">
        <div class="card-body">
          Votre trajet de <b>{{ villeDepart}}</b> à <b>{{ villeArrive}}</b>
        </div>
      </div>
    <small>{{searchResult.length}} résultats</small>
      <search-result v-for="travel in searchResult" v-bind:travel="travel" v-bind:key="travel.id">      </search-result>
    </div>
</template>

<script>
    import SearchResult from "../components/searchResult";
    export default {
        name: "Search",
      components: {SearchResult},
      data() {
          return {
            villeDepart: "",
            villeArrive: "",
            searchResult: []
          }
      },
      created()  {
          this.villeDepart = this.$route.params.villeDepart;
          this.villeArrive = this.$route.params.villeArrive;
          this.getSearchResults();
      },
      methods: {
          getSearchResults() {
            this.$http.post("travels/search", {
              lieuDepart: this.villeDepart,
              lieuArrivee: this.villeArrive,
              dateDepart: ""
            }).then(response => {
              this.searchResult = response.data.travel;
            })
          }
      }
    }
</script>

<style scoped>

</style>
