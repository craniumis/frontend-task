<script>
export default {
  name : "Logout",
  methods:{
    logout(){
      this.$store.dispatch('logout');
      this.$router.push('/');
    }
  },
  created() {
    this.logout();
  }
}

</script>

<template>

</template>

