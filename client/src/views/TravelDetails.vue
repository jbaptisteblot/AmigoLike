<template>
  <div class="container">
    <div v-if="this.reservationUser.length !== 0"  class="alert alert-success">
      Félicitation vous voyagez à bord de ce trajet, voici les informations du conducteur :
      <p v-if="travel.owner.preferencesVoyageurs.phoneAccess">Téléphone : {{travel.owner.phone}}</p>
      <p v-if="travel.owner.preferencesVoyageurs.emailAccess">Email : {{travel.owner.email}}</p>
    </div>
    <h1>Détails du voyage</h1>
    <div class="row">
      <div class="card col-sm">
        <div class="card-body">
          <b>Départ : </b> {{ villeDepart}}<br>
          <b>Arrivée : </b> {{ villeArrive}}<br>
          <b>Passages</b> : {{ trips | beginningToEnd }}<br>
          <b>Prix par personne :</b> ${{ trips | calculatePrice(villeDepart, villeArrive, 1)}}
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
            <b>Places restantes : {{ travel.numberPassengers - ((trip.reservations !== undefined)?trip.reservations.reduce((accumulator, currentValue) => accumulator + currentValue.place, 0):0) }}</b>
            <hr>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div class="form-inline justify-content-center" v-if="canReserve">
      <label for="places">Nombre de places à réserver</label>
      <select name="places" id="places" class="custom-select" v-model="placesToReserve">
        <option v-for="i in remainingPlaces" v-bind:key="i" :name="i">{{i}}</option>
      </select>
      <button class="btn btn-success btn-lg" data-toggle="modal" data-target="#paymentModal">
        Réserver
      </button>
    </div>

    <button class="btn btn-danger btn-lg" v-if="hasReserved" v-on:click="cancelReservation()">
        Annuler réservation
    </button>

  <!-- Modal -->
  <div class="modal fade" id="paymentModal" tabindex="-1" role="dialog" aria-labelledby="paiementModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="paiementModalLabel">Paiement</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Pour pouvoir faire la réservation, il faut d'abord procéder au paiement de
          <strong>${{ trips | calculatePrice(villeDepart, villeArrive, Number.parseInt(placesToReserve))}}</strong>.
          <hr>

          <label for="paiementInput">Veuillez entrer un montant</label>
          <input type="number" class="form-control" v-model="montant" aria-describedby="paiementHelp" placeholder="">
          <small id="paiementHelp" class="form-text text-muted">Entrer un nombre egal au montant demandé.</small>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-primary" v-if="processPaiementByBank()" v-on:click="reserverVoyage(travel)" data-dismiss="modal">
              Payer & Réserver
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  export default {
    name: "TravelDetails",
    data() {
      return {
        reservationUser: '',
        placesToReserve: 1,
        travel: [],
        trips: [],
        villeDepart: this.$route.params.depart,
        villeArrive: this.$route.params.arrive,
        tripsToReservate: [],
        n: 0,
        owner: {},
        montant: 0
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
        let price = this.$options.filters.calculatePrice(this.trips, this.villeDepart, this.villeArrive, this.placesToReserve);

        this.$http.post("reservations", {
          paid: true,
          price: price,
          place: Number.parseInt(this.placesToReserve),
          owner: user
        }).then(reservation => {
          let reservationId = reservation.data.id;

          let basePath = "reservations/" + reservationId + "/trips/rel/";
          this.reservationUser = reservationId;
          this.tripsToReservate.forEach((tripToReservate, index) => {
            this.$http.put(basePath + tripToReservate.id, {
              reservationId: reservationId,
              tripId: tripToReservate.id
            }).then(() => {
              if(tripToReservate.reservations === undefined)
                this.tripsToReservate[index].reservations = [reservation.data];
              else {
                this.tripsToReservate[index].reservations.push(reservation.data);
              }
              this.$forceUpdate();
            });
          });

        });
      },
      cancelReservation() {
        let url = "reservations/" + this.reservationUser + "/trips";
        this.$http.delete(url).catch(err => console.log(err.data));
        url = "reservations/" + this.reservationUser;
        this.$http.delete(url).catch(err => console.log(err.data));
        this.reservationUser = '';
        this.tripsToReservate.forEach((trip, index) => {
          this.tripsToReservate[index].reservations = trip.reservations.filter(reservation => reservation.owner !== localStorage.getItem('userId'))
        });
        this.$forceUpdate();
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
      },
    processPaiementByBank: function() {
        return this.montant == this.$options.filters.calculatePrice(this.trips, this.villeDepart, this.villeArrive, Number.parseInt(this.placesToReserve));
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
      calculatePrice: function (trips, villeDepart, villeArrive, placesToReserve) {
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
        // On multiplie la somme par le nombre de réservations
        sum = sum * placesToReserve;
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
        const reduceurList = (accumulator, currentValue) => accumulator + currentValue.place;
        const reduceur = (accumulator, currentValue) => Math.min(accumulator, this.travel.numberPassengers - ((currentValue.reservations !== undefined)?currentValue.reservations.reduce(reduceurList, 0):0));
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
