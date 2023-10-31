<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-card header-tag="header">
        <template #header>
          <h6 class="mb-0 text-left">Login</h6>
        </template>
        <form @submit.prevent="login" enctype="multipart/form-data">
          <div class="form-group text-left">
            <label for="input1">Username</label>
            <input v-model="username" id="input1" class="form-control" placeholder="username" />
          </div>
          <div class="form-group text-left">
            <label for="input2">Password</label>
            <input v-model="password" id="input2" class="form-control" placeholder="password" type="password" />
          </div>
          <div class="d-flex justify-content-end">
            <b-button type="submit" variant="primary" size="md">Login</b-button>
          </div>
        </form>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
import AuthService from "@/services/AuthService";
const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#f1f1f1',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
export default {
  data(){
    return{
      username:"",
      password:"",
    }
  },
  methods:{
    async login(){
      const credentials = {
        email: this.username,
        password: this.password
      };
      await AuthService.login(credentials)
          .then((response) => {
            const responseData = response.data;
            if (responseData.status){
              const token = responseData.access_token;
              const user = responseData.data.user;
              this.$store.dispatch('login', { token, user });
              this.$router.push('/company');
            }else{
              Toast.fire({
                title: '<strong>Message</strong>',
                icon: 'warning',
                html:responseData.message,
              })
            }
          })
          .catch((error) => {
            if (error.response.status === 422){
              let message = '';
              for (let k in error.response.data.errors){
                console.log(error.response.data.errors[k]);
                message += error.response.data.errors[k][0];
              }
              Toast.fire({
                title: '<strong>Validation Required</strong>',
                icon: 'warning',
                html:message,
              })
            }
            console.log(error);

          })
    }
  },
  created() {
    if (this.$store.getters.isLoggedIn){
      this.$router.push('/company');
    }
  }
}

</script>
<style scoped lang="scss">
.card{
  margin-top: 100px;
}
</style>