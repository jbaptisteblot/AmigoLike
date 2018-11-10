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
                <img class="card-img-top" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
            <div class="card col-sm">
                <div class="card-body">
                    <div v-for="(trip, index) in tripsToReservate" v-bind:key="trip.id">
                        <b>Passage {{ index + 1 }}:</b> {{ trip.beginLocation }} prévu à {{ trip.beginDate }}
                        <hr>
                    </div>
                </div>
            </div>
        </div><br>
        <button class="btn btn-success btn-lg" v-on:click="reserverVoyage(travel)">Reserver</button>
    </div>
</template>

<script>
export default {
    name: "TravelDetails",
    data() {
        return {
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
        this.getTripsByTravel();
    },
    methods: {
        getTravelById() {
            let travelParam = this.$route.params.idTravel;
            this.$http.get("travels/"+ travelParam, {

            }).then(res => {
                this.travel = res.data;

                console.log(res.data);

                this.getOwnerByTravel();

            });
        },
        getTripsByTravel() {
            let travelParam = this.$route.params.idTravel;
            this.$http.get("travels/"+ travelParam+ "/trips", {

            }).then(res => {
                this.trips = res.data;
                this.searchDepartureFromEndLocation(this.villeArrive);
            });
        },
        reserverVoyage() {
            // Creation de la reservation
            let owner = this.travel.owner;
            let user = localStorage.getItem("userId");
            let price = this.$options.filters.calculatePrice(this.trips, this.villeDepart, this.villeArrive);

            console.log(price);
            this.$http.post("reservations", {
                price: price,
                owner: owner,
                utilisateurId: user
            }).then(res => {
                console.log(res);
                let reservationId = res.data.id;

                // Reservation du/des trip(s)
                //this.tripsToReservate.clear();
                //this.searchDepartureFromEndLocation(this.villeArrive);
                let basePath = "reservations/"+ reservationId + "/trips/rel/";

                for (var tripToReservate of this.tripsToReservate) {
                    this.$http.put(basePath + tripToReservate.id, {
                        reservationId: reservationId,
                        tripId: tripToReservate.id
                    }).then(res => {
                        console.log(res);
                    });
                }

            });
        },
        searchDepartureFromEndLocation(endTown) {
            for (var trip of this.trips) {
                if (trip.endLocation.localeCompare(endTown) == 0) {
                    console.log(trip.endLocation);
                    this.tripsToReservate.push(trip);
                    this.searchDepartureFromEndLocation(trip.beginLocation);
                }
            }
        },
        getOwnerByTravel() {
            // GET /travels/{id}/owner
            let path = "/Utilisateurs/" + this.travel.owner;
            /*this.$http.get(path)
            .then(res => {
            this.owner = res.data;
        });*/
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
    },
    calculatePrice: function(trips, villeDepart, villeArrive) {
        let sum = 0;
        for (var trip of trips) {
            if (trip.beginLocation.localeCompare(villeDepart) == 0 && trip.endLocation.localeCompare(villeArrive) == 0) {
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
}
</script>

<style scoped>
img {
  display: block;
  width: auto;
  height: auto;
}
</style>
