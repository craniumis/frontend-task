<template>
  <div class="container">
    <div class="row">
      <div class="mt-5 pt-5">
        <nav-bar></nav-bar>
        <div class="col-md-10">

        </div>
      </div>

    </div>
  </div>
</template>

<script>

import HelloWorld from '@/components/HelloWorld.vue'
import NavBar from "@/components/NavBar.vue";
export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    NavBar,
  },
  data(){
    return{
      username:""
    }
  },
  created() {
    if (this.$store.getters.isLoggedIn){
      this.username = this.$store.getUser;


    }else{
      this.$router.push('/login')
    }

  }
}
</script>
