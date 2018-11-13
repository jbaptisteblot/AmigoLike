<template>
  <div class="container">
    <h1>Détails du voyage</h1>
    <div class="row">
      <div class="card col-sm">
        <div class="card-body">
          <b>Départ : </b> {{ villeDepart}}<br>
          <b>Arrivée : </b> {{ villeArrive}}<br>
          <b>Passages</b> : {{ trips | beginningToEnd }}<br>
          <b>Prix :</b> ${{ trips | calculatePrice(villeDepart, villeArrive)}}
        </div>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="card col-sm" style="width: 12rem;">
        <div class="card-body" v-if="travel.owner !== undefined">
          <h5 class="card-title">Conducteur</h5>
          <p class="card-text">{{travel.owner.name}} {{travel.owner.surname}}</p>
          <hr>
          <div v-for="(value, index) in travel.owner.preferencesVoyageurs" v-bind:key="index">
            <p class="card-text" v-if="!index.toLowerCase().includes('id')" >{{index}} : {{value}}</p>
          </div>
        </div>
      </div>
      <div class="card col-sm">
        <div class="card-body" v-if="tripsToReservate[0] !== undefined">
          <div v-for="(trip, index) in tripsToReservate" v-bind:key="trip.id">
            <b>Passage {{ index + 1 }}:</b> {{ trip.beginLocation }} prévu à {{ trip.beginDate }}
            <br>
            <b>Places restantes : {{ travel.numberPassengers - ((trip.reservations !== undefined)?trip.reservations.length:0) }}</b>
            <hr>
          </div>
        </div>
      </div>
    </div>
    <br>
    <button class="btn btn-success btn-lg" v-if="canReserve" v-on:click="reserverVoyage(travel)">Reserver</button>
  </div>
</template>

<script>
  export default {
    name: "TravelDetails",
    data() {
      return {
        reservationUser: '',
        travel: [],
        trips: [],
        villeDepart: this.$route.params.depart,
        villeArrive: this.$route.params.arrive,
        tripsToReservate: [],
        n: 0,
        owner: {}
      }
    },
    created() {
      this.getTravelById();
    },
    methods: {
      getTravelById() {
        let travelParam = this.$route.params.idTravel;
        this.$http.get("travels/" + travelParam, {
          params: {
            filter: {
              include: [{trips: "reservations"}, {owner: "preferencesVoyageurs"}]
            }
          }
        }).then(res => {
          this.travel = res.data;
          this.trips = this.travel.trips;
          this.searchDepartureFromEndLocation(this.villeArrive);
          this.findReservationIdUser();
        });
      },
      reserverVoyage() {
        // Creation de la reservation
        let user = localStorage.getItem("userId");
        let price = this.$options.filters.calculatePrice(this.trips, this.villeDepart, this.villeArrive);

        this.$http.post("reservations", {
          price: price,
          owner: user
        }).then(res => {
          console.log(res);
          let reservationId = res.data.id;

          let basePath = "reservations/" + reservationId + "/trips/rel/";
          this.reservationUser = reservationId;
          this.tripsToReservate.forEach((tripToReservate, index) => {
            this.$http.put(basePath + tripToReservate.id, {
              reservationId: reservationId,
              tripId: tripToReservate.id
            }).then(res => {
              if(tripToReservate.reservations === undefined)
                this.tripsToReservate[index].reservations = [res.data];
              else {
                this.tripsToReservate[index].reservations.push(res.data);
              }
              this.$forceUpdate();
            });
          });

        });
      },
      searchDepartureFromEndLocation(endTown) {
        for (var trip of this.trips) {
          if (trip.endLocation.localeCompare(endTown) === 0) {
            this.tripsToReservate.unshift(trip);
            this.searchDepartureFromEndLocation(trip.beginLocation);
          }
        }
      },
      findReservationIdUser: function() {
        this.tripsToReservate.forEach(trip => {
          if (trip.reservations !== undefined) {
            trip.reservations.forEach(reservation => {
              if(reservation.owner === localStorage.getItem('userId'))
                this.reservationUser = reservation.id;
            })
          }
        });
      }
    },
    filters: {
      beginningToEnd: function (trips) {
        let villesArray = [];

        trips.forEach(trip => {
          if (villesArray.indexOf(trip.beginLocation) === -1)
            villesArray.push(trip.beginLocation);
          if (villesArray.indexOf(trip.endLocation) === -1)
            villesArray.push(trip.endLocation);
        });
        return villesArray.join(", ");
      },
      calculatePrice: function (trips, villeDepart, villeArrive) {
        let sum = 0;
        for (let trip of trips) {
          if (trip.beginLocation.localeCompare(villeDepart) === 0 &&
            trip.endLocation.localeCompare(villeArrive) === 0) {
            sum = 0;
            sum = trip.price;
            break;
          } else {
            sum += trip.price;
          }
        }
        return sum;
      }
    },
    computed: {
      hasReserved: function () {
        return (this.reservationUser.length > 0)
      },
      remainingPlaces: function() {
        if (this.tripsToReservate[0] === undefined)
          return 0;
        const reduceur = (accumulator, currentValue) => Math.min(accumulator, this.travel.numberPassengers - ((currentValue.reservations !== undefined)?currentValue.reservations.length:0));
        return this.tripsToReservate.reduce(reduceur, this.travel.numberPassengers);
      },
      canReserve: function() {
        if (localStorage.getItem("userId") === null ||
          this.travel.owner === undefined ||
          this.travel.owner.id === localStorage.getItem("userId") ||
          this.hasReserved ||
          (new Date(this.tripsToReservate[0].beginDate) < new Date())
        )
          return false;

        return (this.remainingPlaces > 0);
      }
    }
  }
</script>

<style scoped>
  img {
    display: block;
    width: auto;
    height: auto;
  }
</style>
