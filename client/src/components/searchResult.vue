<template>
  <div>
    <div class="card">
      <div class="card-body">
        <ul>
          <li>
            Prix : {{travel.price}}
          </li>
          <li>
            Places restantes : {{travel.remainingPlaces}}
          </li>
          <li>
            Passages : {{travel.trips | beginningToEnd }}
          </li>
          <li>
            Price : {{ travel.price }}<br>
            <router-link v-bind:to="{name: 'travelDetails', params: {idTravel: travel.id, depart:this.$route.params.villeDepart , arrive: this.$route.params.villeArrive}}">Details</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "searchResult",
        props: ['travel'],
        data() {
            return {
                begin: this.$route.params.villeDepart,
                end: this.$route.params.villeArrive
            }
        },
        filters: {
          beginningToEnd: function(trips) {
            let villesArray = [];

            trips.forEach(trip => {
              if (villesArray.indexOf(trip.beginLocation) === -1)
                villesArray.push(trip.beginLocation);
              if (villesArray.indexOf(trip.endLocation) === -1)
                villesArray.push(trip.endLocation);
            });
            return villesArray.join(", ");
          }
      },
      methods: {
          reserverVoyage(travel) {
              console.log(travel);
          }
      }
    }
</script>

<style scoped>

</style>
