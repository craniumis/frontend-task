<template>
  <b-container>
    <b-row>
      <nav-bar></nav-bar>
      <b-col col md="10">
        <b-card header-tag="header">
          <template #header>
            <h6 class="mb-0 text-left"><b-button v-b-modal.Add-Modal><b-icon-plus-circle></b-icon-plus-circle></b-button> Employees</h6>
          </template>



          <b-table ref="gridEmployees"
                   :items="gridEmployees.items"
                   :fields="gridEmployees.columns"
                   :per-page="0"
                   :current-page="gridEmployees.currentPage"
                   responsive
                   striped
                   hover
          >
            <template #cell(show_details)="row">
              <ul class="list-inline">
                <li class="list-inline-item"><a href="javascript:void(0)" @click="editEmployee(row.index, row.item, $event.target)" class="btn btn-primary btn-sm"><b-icon-pencil-square></b-icon-pencil-square></a> </li>
                <li class="list-inline-item"><a href="javascript:void(0)" @click="deleteEmployee(row.index, row.item, $event.target, row)" class="btn btn-danger btn-sm"><b-icon-trash-fill></b-icon-trash-fill></a> </li>
              </ul>
            </template>
          </b-table>
          <div class="d-flex justify-content-between" v-if="gridEmployees.totalRows > 0">
            <div>
              Total Records:{{gridEmployees.totalRows}}
            </div>
            <b-pagination
                v-model="gridEmployees.currentPage"
                :total-rows="gridEmployees.totalRows"
                :per-page="gridEmployees.perPage"
                align="fill"
                size="sm"
                class="my-0"
            ></b-pagination>




          </div>

        </b-card>
      </b-col>
      <!--/ Add Modal /-->
      <b-modal ref="Add-Modal" id="Add-Modal" no-close-on-backdrop centered title="Add Employee" @hide="resetModalFields">
        <b-form-group>
          <label class="col-form-label">Name</label>
          <b-form-input v-model="objEmployee.first_name" placeholder="First Name" type="text"></b-form-input>
        </b-form-group>
        <b-form-group>
          <label class="col-form-label">Last Name</label>
          <b-form-input v-model="objEmployee.last_name" placeholder="Last Name" type="text"></b-form-input>
        </b-form-group>

        <b-form-group>
          <label class="col-form-label">Company</label>
          <b-form-select v-model="objEmployee.company" :options="ddl_company"></b-form-select>
        </b-form-group>

        <b-form-group>
          <label class="col-form-label">Email</label>
          <b-form-input v-model="objEmployee.email" placeholder="email@domain.com" type="email"></b-form-input>
        </b-form-group>

        <b-form-group>
          <label class="col-form-label">Phone</label>
          <b-form-input id="inputEmail" v-model="objEmployee.phone" placeholder="123456789" type="number"></b-form-input>
        </b-form-group>

        <template #modal-footer>
          <div class="w-100">
            <b-button variant="warning" size="md" @click="$root.$emit('bv::hide::modal', 'Add-Modal', $event.target)">Cancel</b-button>
            <b-button variant="primary" size="md" class="float-right" @click="saveEmployee">Save</b-button>
          </div>
        </template>
      </b-modal>
      <!--/ Add Modal /-->
      <!--/ Edit Modal /-->
      <b-modal ref="Edit-Modal" id="Edit-Modal" no-close-on-backdrop centered title="Edit Employee" @hide="resetModalFields">
        <b-form-group>
          <label class="col-form-label">First Name</label>
          <b-form-input v-model="objEmployee.first_name" placeholder="First Name" type="text"></b-form-input>
        </b-form-group>
        <b-form-group>
          <label class="col-form-label">Last Name</label>
          <b-form-input v-model="objEmployee.last_name" placeholder="Last Name" type="text"></b-form-input>
        </b-form-group>
        <b-form-group>
          <label class="col-form-label">Company {{objEmployee.company}}</label>
          <b-form-select v-model="objEmployee.company" :options="ddl_company"></b-form-select>
        </b-form-group>
        <b-form-group>
          <label class="col-form-label">Email</label>
          <b-form-input v-model="objEmployee.email" placeholder="email@domain.com" type="email"></b-form-input>
        </b-form-group>
        <b-form-group>
          <label class="col-form-label">Phone</label>
          <b-form-input v-model="objEmployee.phone" placeholder="1234567" type="number"></b-form-input>
        </b-form-group>

        <template #modal-footer>

          <div class="d-flex justify-content-between w-100">
            <b-button variant="warning" size="md" @click="$root.$emit('bv::hide::modal', 'Edit-Modal', $event.target)">Cancel</b-button>
            <b-button variant="primary" size="md" @click="updateEmployee(selected_employee_id)">Update</b-button>
          </div>
        </template>
      </b-modal>
      <!--/ Edit Modal /-->
    </b-row>
  </b-container>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
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
  name:"Employee",
  components:{
    NavBar
  },
  data(){
    return{
      gridEmployees:{
        items:[],
        totalRows:0,
        currentPage:1,
        perPage:10,
        columns:[
          "id", "company_name", "full_name", "email", "phone",
          {
            key:'show_details',
            label:'Action'
          }
        ]
      },
      isBusy:false,
      objEmployee:{
        first_name:"",
        last_name:"",
        company:0,
        email:"",
        phone:""
      },
      ddl_company:[],
      selected_employee_id:0,
      params:'',
    }
  },
  methods:{
    resetModalFields(){
      this.objEmployee.first_name = "";
      this.objEmployee.last_name = "";
      this.objEmployee.company = "";
      this.objEmployee.email = "";
      this.objEmployee.phone = "";
    },
    async getAllCompanies(){
      await AuthService.getAllCompanies()
          .then((response) => {
            let responseData = response.data;
            if (responseData.status){
              this.ddl_company = responseData.data.map(item => ({
                value:item.id,
                text:item.name
              }));
            }else{
              Toast.fire({
                title: '<strong>Message</strong>',
                icon: 'warning',
                html:responseData.message,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });

    },
    async getEmployees(){
      let $this = this;
      this.isBusy = true;
      this.params = `?page=${this.gridEmployees.currentPage}&limit=${this.gridEmployees.perPage}`;
      await AuthService.getEmployees(this.params)
          .then((response) => {
            let responseData = JSON.parse(JSON.stringify(response.data));
            if (responseData.status){
              $this.gridEmployees.items = responseData.data.data;
              $this.gridEmployees.totalRows = responseData.data.meta.total;
              $this.gridEmployees.currentPage = responseData.data.meta.current_page;
              $this.gridEmployees.perPage = responseData.data.meta.per_page;
              $this.isBusy = false;
            }else{
              Toast.fire({
                title: '<strong>Message</strong>',
                icon: 'warning',
                html:responseData.message,
              });
            }
          })
          .catch((error) => {
            this.gridEmployees.items = [];
            console.log(error);
          });
    },
    async saveEmployee(){
      let formData = new FormData();
      for(const k in this.objEmployee){
        formData.append(k, this.objEmployee[k]);
      }
      await AuthService.saveEmployee(formData)
          .then(response => {
            let responseData = response.data;
            if (responseData.status){
              Toast.fire({
                title: '<strong>Success</strong>',
                icon: 'success',
                html:responseData.message,
              });
              this.$refs["Add-Modal"].hide();
              this.getEmployees();
            }else{
              Toast.fire({
                title: '<strong>Message</strong>',
                icon: 'success',
                html:responseData.message,
              });
            }
          })
          .catch(error => {
            if (error.response.status == 422){
              let serverErrors = error.response.data.errors;
              let message = '';
              for (let k in serverErrors){
                message += serverErrors[k][0] + '<br/>';
              }
              Toast.fire({
                title: '<strong>Validation Required</strong>',
                icon: 'warning',
                html:message,
              })
            }
          });
    },
    async editEmployee(idx, item, elm){
      await AuthService.getEmployeeById(item.id)
          .then((response) => {
            let responseData = response.data;
            if (responseData.status){
              this.objEmployee.first_name = responseData.data.first_name;
              this.objEmployee.last_name = responseData.data.last_name;
              this.objEmployee.company = responseData.data.company_id;
              this.objEmployee.email = responseData.data.email;
              this.objEmployee.phone = responseData.data.phone;
              this.selected_employee_id = item.id;
              this.$refs["Edit-Modal"].show();
            }else{
              Toast.fire({
                title: '<strong>Message</strong>',
                icon: 'warning',
                html:responseData.message,
              });
            }
          })
          .catch((error) => {
              console.log(error);
          });
    },
    async updateEmployee(employeeId){
      let formData = new FormData();
      formData.append('_method', 'PUT');
      for (const k in this.objEmployee){
        formData.append(k, this.objEmployee[k]);
      }
      await AuthService.updateEmployee(employeeId, formData)
          .then((response) => {
            let responseData = response.data;
            if (responseData.status){
              Toast.fire({
                title: '<strong>Success</strong>',
                icon: 'success',
                html:responseData.message,
              });
              this.$refs["Edit-Modal"].hide();
              this.getEmployees();
            }else{
              Toast.fire({
                title: '<strong>Message</strong>',
                icon: 'warning',
                html:responseData.message,
              });
            }
          })
          .catch(error => {
            if (error.response.status === 422){
              let serverErrors = error.response.data.errors;
             let message = '';
             for (let k in serverErrors){
                message += serverErrors[k][0];
             }
              Toast.fire({
                title: '<strong>Validation Required</strong>',
                icon: 'warning',
                html:message,
                showCloseButton: true,
                showCancelButton: false,
              });
            }

          });
    },
    deleteEmployee(idx, item, elm, row){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await AuthService.deleteEmployee(item.id)
              .then(response => {
                let responseData = response.data;
                if (responseData.status){
                  Toast.fire({
                    title: '<strong>Success</strong>',
                    icon: 'success',
                    html:responseData.message,
                  });
                  this.$refs["Edit-Modal"].hide();
                  this.$root.$emit('bv::refresh::table', 'gridEmployees');
                  this.getEmployees();
                }else{
                  Toast.fire({
                    title: '<strong>Message</strong>',
                    icon: 'warning',
                    html:responseData.message,
                  });
                }
              })
              .catch(error => {
                console.log(error);
              });
        }
      });
    },
  },
  watch: {
    'gridEmployees.currentPage': {
      handler: function (value) {
        this.params = `page=${value}&size=${this.gridEmployees.perPage}`;
        this.getEmployees();
      },
    },
  },
  created() {
    this.getAllCompanies();
    this.getEmployees();
  }
}

</script>
