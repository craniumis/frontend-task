<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import AuthService from "@/services/AuthService";
export default {
  data(){
    return {
      secretMessage:"",
      username:'',
    }
  },
  created() {
    if (this.$store.getters.isLoggedIn){
      this.username = this.$store.getUser;
      let companies = AuthService.getCompanies();
      console.log(companies);

    }else{
      this.$router.push('/login')
    }

  }
}
</script>