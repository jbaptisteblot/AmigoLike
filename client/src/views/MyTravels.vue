<template>
    <div>
      <create-travel v-on:new-trip="addTravel"></create-travel>
      <div v-for="travel in travels" v-bind:key="travel.id">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title" v-if="travel.trips.length > 0">Votre trajet entre {{travel.trips[0].beginLocation}} et {{travel.trips[travel.trips.length -1].endLocation}}</h5>
            <h6 class="card-subtitle mb-2 text-muted" v-if="travel.trips.length > 0">{{travel.trips[0].beginDate}}</h6>
            <p class="card-text"></p>
            <router-link :to="{name: 'travelDetails', params: {idTravel: travel.id, depart: travel.trips[0].beginLocation, arrive: travel.trips[travel.trips.length -1].endLocation}}" class="card-link">Voir la fiche du trajet</router-link>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
    import CreateTravel from "../components/CreateTravel";
    export default {
        name: "MyTravels",
      components: {CreateTravel},
      data() {
          return {
            travels: []
          }
        },
        created() {
          this.getUserTravels();
        },
        methods: {
          getUserTravels() {
            this.$http.get("travels", {
              params: {
                filter :
            {where:
                      {owner: localStorage.getItem("userId")},
                    include: "trips"
                  }
              }
            }).then(response => this.travels = response.data).catch(error => console.log(error))
          },
          addTravel(payload) {
            this.travels.push(payload);
          }
        }
    }
</script>

<style scoped>

</style>
