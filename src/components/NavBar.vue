<template>
  <div class="col-md-2">
    <ul class="navigation">
      <li><router-link to="/company">Companies</router-link></li>
      <li><router-link to="/employee">Employees</router-link></li>
      <li><a class="nav-link" href="javascript:void(0)" @click="logout">Logout</a></li>
    </ul>
  </div>
</template>
<script>
import AuthService from "@/services/AuthService";
export default {
  name:"NavBar",
  created() {
    if (this.$store.getters.isLoggedIn){


    }else{
      this.$router.push('/')
    }
  },
  methods:{
    async logout() {
      await AuthService.logout()
      .then((response) => {
        let responseData = response.data;
        if (responseData.status){
          this.$store.dispatch('logout');
          this.$router.push('/');
        }

      })
      .catch((error) => {

      });
    }
  }
}
</script>
