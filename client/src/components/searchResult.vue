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
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "searchResult",
        props: ['travel'],
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
        }
    }
</script>

<style scoped>

</style>
