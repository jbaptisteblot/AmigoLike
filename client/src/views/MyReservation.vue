<template>
  <div>
    <div v-for="reservation in reservations" v-bind:key="reservation.id">
      <div class="card m-1">
        <div class="card-body" v-if="reservation.trips !== undefined && reservation.trips.length > 0">
          <h5 class="card-title" v-if="reservation.trips.length > 0">Votre réservation entre {{reservation.trips[0].beginLocation}} et
            {{reservation.trips[reservation.trips.length -1].endLocation}}</h5>
          <h6 class="card-subtitle mb-2 text-muted" v-if="reservation.trips.length > 0">{{reservation.trips[0].beginDate}}</h6>
          <hr>
          <p class="card-text">Nombre de places réservées : {{ reservation.place}}</p>
          <div v-if="reservation.trips[0].ownerObj !== undefined">
            <b>Informations de contact</b>
            <p class="card-text">Trajet par : {{reservation.trips[0].ownerObj.name}} {{reservation.trips[0].ownerObj.surname}}</p>
            <p v-if="reservation.trips[0].ownerObj.preferencesVoyageurs.phoneAccess">Téléphone : {{reservation.trips[0].ownerObj.phone}}</p>
            <p v-if="reservation.trips[0].ownerObj.preferencesVoyageurs.emailAccess">Email : {{reservation.trips[0].ownerObj.email}}</p>
          </div>
          <router-link
            :to="{name: 'travelDetails', params: {idTravel: reservation.trips[0].travelId, depart: reservation.trips[0].beginLocation, arrive: reservation.trips[reservation.trips.length -1].endLocation}}"
            class="card-link">Voir la fiche du trajet
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "MyReservation",
        data() {
          return {
            reservations: []
          }
        },
        created() {
          this.getUserReservations();
        },
        methods: {
          getUserReservations() {
            this.$http.get("reservations", {
              params: {
                filter:
                  {
                    where:
                      {owner: localStorage.getItem("userId")},
                    include: "trips"
                  }
              }
            }).then(response => {
              this.reservations = response.data;
              this.reservations.forEach((reservation, index) => {
                if(reservation.trips.length > 0) {
                  this.getOwnerTrip(reservation.trips[0]);
                }
              });

            }).catch(error => console.log(error))
          },
          getOwnerTrip(trip) {
            this.$http.get('travels/' + trip.travelId, {
              params: {
                filter:
                  {
                    include: {
                      "owner": "preferencesVoyageurs"
                    }
                  }
              }
            }).then(res => {trip.ownerObj = res.data.owner; this.$forceUpdate();})
          }
        }
    }
</script>

<style scoped>

</style>
