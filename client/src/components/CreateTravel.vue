<template>
  <div class="row justify-content-center">
    <div class="card col-md-9">
      <div class="card-body">
        <div>
          <div class="form-group">
            <div v-if="this.error.length !== 0"  class="alert alert-danger">
              {{error}}
            </div>
            <h4>Ajouter un nouveau trajet</h4>
            <div class="form-group">
              <label for="numberPassengers">Nombre de passagers</label>
              <input type="number" name="numberPassengers" id="numberPassengers" class="form-control" v-model="nombrePassagers" required>
            </div>
            <div class="form-group">
              <label for="beginDate">Date et heure de départ</label>
              <input type="datetime-local" name="beginDate" id="beginDate" class="form-control" :min="today" v-model="beginDate" required>
            </div>
            <h4>Vos points de passage</h4>
            <div class="form-group">
              <label for="departurePlace">Lieu de départ</label>
              <input type="text" name="departurePlace" id="departurePlace" class="form-control" v-model="beginLocation" required>
            </div>
            <span v-on:click="addTrip">Ajouter étape</span>
            <div v-for="(tripStep, index) in tripLists" v-bind:key="index">
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
            error: '',
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
      created() {
        this.beginDate = this.today;
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
              let tripId = response.data.id;
              let postPromises = [];
              this.trips.forEach(trip => {

                postPromises.push(this.$http.post('travels/' + tripId + '/trips',
                  trip));
              });
              Promise.all(postPromises).then(response => {
                this.$emit('new-trip', {id: tripId, numberPassengers: this.nombrePassagers, trips: this.trips});
                console.log(response)
              }).catch(error => this.error = error)
            }).catch(error => console.log(error))
          },
        checkDestination() {
            let errorFound = false;
            let destinationList = [this.beginLocation.toLowerCase()];
            this.tripLists.forEach(trip => {

                if(destinationList.indexOf(trip.pointEtape.toLowerCase()) === -1)
                  destinationList.push(trip.pointEtape.toLowerCase());
                else
                  errorFound = true;
            });
            if (errorFound)
              return "Vous ne pouvez pas aller plusieurs fois au même endroit.";
            else
              return null;
        },
        checkPrice() {
          this.tripLists.forEach(trip => {
            if (trip.price <= 0)
              return "Merci de vérifier les prix.";
          });
        },
        checkValues() {
          let errorList = [];
          errorList.push(this.checkDestination());
          errorList.push(this.checkPrice());
          this.error = errorList.join('');
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
          },
        today: () => {
          let today = new Date();
          let dd = today.getDate();
          let mm = today.getMonth()+1;
          let minutes = today.getMinutes();
          if(dd<10){
            dd='0'+dd
          }
          if(mm<10){
            mm='0'+mm
          }
          if(minutes<10){
            minutes='0'+minutes
          }

          //YYYY-MM-DDThh:mm:ss.ms
          return today.getFullYear() +'-'+mm+'-'+dd + "T"+ today.getHours() + ":" + minutes;
        }
      },
      watch: {
        nombrePassagers: function(val) {
          this.nombrePassagers = (val > 0)?val:1;
        },
        tripLists: {
          handler: function() {
            this.checkValues();
          },
          deep: true
        }

      }
    }
</script>

<style scoped>

</style>
