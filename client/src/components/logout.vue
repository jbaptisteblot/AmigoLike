
<script>
    export default {
        name: "logout",
        created() {
          this.$http.post("Utilisateurs/logout").then(() => {
          });
          localStorage.removeItem("accessId");
          this.$emit('user-logged', false);
          this.$router.push("/");
        }
    }
</script>

<style scoped>

</style>
