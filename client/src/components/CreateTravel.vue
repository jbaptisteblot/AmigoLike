<template>
  <div class="row justify-content-center">
    <div class="card col-md-9">
      <div class="card-body">
        <div>
          <div class="form-group">
            <h4>Ajouter un nouveau trajet</h4>
            <div class="form-group">
              <label for="numberPassengers">Nombre de passagers</label>
              <input type="number" name="numberPassengers" id="numberPassengers" class="form-control" v-model="nombrePassagers" required>
            </div>
            <div class="form-group">
              <label for="beginDate">Date et heure de départ</label>
              <input type="datetime-local" name="beginDate" id="beginDate" class="form-control" v-model="beginDate" required>
            </div>
            <h4>Vos points de passage</h4>
            <div class="form-group">
              <label for="departurePlace">Lieu de départ</label>
              <input type="text" name="departurePlace" id="departurePlace" class="form-control" v-model="beginLocation" required>
            </div>
            <span v-on:click="addTrip">Ajouter étape</span>
            <div v-for="(tripStep, index) in tripLists" v-bind:key="tripStep">
              <div class="form-inline">
                <div class="form-group">
                  <label for="stopPlace" v-if="index === (tripLists.length -1)">Arrivée</label>
                  <label for="stopPlace" v-else>Etape</label>
                  <input type="text" name="stopPlace" id="stopPlace" class="form-control" v-model="tripStep.pointEtape" required>
                </div>
                <div class="form-group">
                  <label for="travelTime">Temps de trajet</label>
                  <input type="time" name="travelTime" id="travelTime" class="form-control" v-model="tripStep.travelTime" required>
                </div>
                <div class="form-group">
                  <label for="price">Prix</label>
                  <input type="number" name="price" id="price" class="form-control" v-model="tripStep.price" required>
                </div>
              </div>
            </div>
            <input type="submit" class="btn btn-outline-success" v-on:click="postTrip">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "CreateTravel",
        data() {
          return {
            beginLocation:'',
            nombrePassagers: '',
            beginDate: '',
            tripLists: [{
              pointEtape: '',
              travelTime: '',
              price: 0
            }]
          }
        },
      methods: {
          addTrip() {
            this.tripLists.unshift({
              pointEtape: '',
              travelTime: '',
              price: 0
            })
          },
          getTrip(beginLocation, endLocation, beginDate, endDate, price) {
            return {
              beginLocation: beginLocation,
              endLocation: endLocation,
              beginDate: beginDate.toISOString(),
              endDate: endDate.toISOString(),
              price: price
            }
          },
          postTrip() {
            this.$http.post('/travels',
            {
              numberPassengers: this.nombrePassagers,
              owner: localStorage.getItem("userId")
            }).then(response => {
              console.log(response.data.id);
              this.trips.forEach(trip => {
                this.$http.post('travels/' + response.data.id + '/trips', trip)
              }).catch(error => console.log(error))
            }).catch(error => console.log(error))
          }
      },
      computed: {
          trips: function() {
            let trips = [];
            let nextBeginLocation = this.beginLocation;
            let nextBeginDate = new Date(this.beginDate);
            this.tripLists.forEach(trip => {
              let heure = parseInt(trip.travelTime.split(':')[0]);
              let minutes = parseInt(trip.travelTime.split(':')[1]);
              let timetoAdd = heure*60*60*1000 + minutes*60*1000;
              let endDate = new Date(nextBeginDate.getTime() + timetoAdd);
              trips.push(this.getTrip(nextBeginLocation, trip.pointEtape, nextBeginDate, endDate, trip.price));
              nextBeginLocation = trip.pointEtape;
            });
            return trips;
          }
      }
    }
</script>

<style scoped>

</style>
