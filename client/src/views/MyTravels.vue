<template>
    <div>
      <div v-for="travel in travels" v-bind:key="travel.id">
        {{travel.id}}
      </div>
    </div>
</template>

<script>
    export default {
        name: "MyTravels",
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
          }
        }
    }
</script>

<style scoped>

</style>
