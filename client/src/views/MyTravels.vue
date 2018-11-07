<template>
    <div>
      <create-travel></create-travel>
      <div v-for="travel in travels" v-bind:key="travel.id">
        {{travel.id}}
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
          }
        }
    }
</script>

<style scoped>

</style>
