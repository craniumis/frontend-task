<template>
  <b-container>
    <b-row>
      <nav-bar></nav-bar>
      <b-col col md="10">
        <b-card header-tag="header">
          <template #header>
            <h6 class="mb-0 text-left"><b-button v-b-modal.Add-Modal><b-icon-plus-circle></b-icon-plus-circle></b-button> Companies</h6>
          </template>


          <b-table ref="gridCompanies"
              :items="gridCompanies.items"
              :fields="gridCompanies.columns"
              :per-page="0"
              :current-page="gridCompanies.currentPage"
              responsive
              striped
              hover
          >
            <template #cell(logo_preview)="row">
              <b-img v-if="row.item.image != ''" thumbnail :src="row.item.image" fluid alt="Responsive image" style="width:50px; height: 50px;"></b-img>
            </template>
            <template #cell(show_details)="row">
              <ul class="list-inline">
                <li class="list-inline-item"><a href="javascript:void(0)" @click="editCompany(row.index, row.item, $event.target)" class="btn btn-primary btn-sm"><b-icon-pencil-square></b-icon-pencil-square></a> </li>
                <li class="list-inline-item"><a href="javascript:void(0)" @click="deleteCompany(row.index, row.item, $event.target)" class="btn btn-danger btn-sm"><b-icon-trash-fill></b-icon-trash-fill></a> </li>
              </ul>
            </template>
          </b-table>


          <div class="d-flex justify-content-between" v-if="gridCompanies.totalRows > 0">
            <div>
              Total Records:{{gridCompanies.totalRows}}
            </div>

            <b-pagination
                v-model="gridCompanies.currentPage"
                :total-rows="gridCompanies.totalRows"
                :per-page="gridCompanies.perPage"
                align="fill"
                size="sm"
                class="my-0"
                ></b-pagination>

          </div>

        </b-card>
      </b-col>
      <!--/ Add Modal /-->
      <b-modal ref="Add-Modal" id="Add-Modal" no-close-on-backdrop centered title="Add Company" @hide="resetModalFields">
        <b-form-group>
          <label class="col-form-label">Name</label>
          <b-form-input v-model="objCompany.name" placeholder="Company Name" type="text"></b-form-input>
        </b-form-group>


        <b-form-group>
          <label class="col-form-label">Email</label>
          <b-form-input v-model="objCompany.email" placeholder="email@domain.com" type="email"></b-form-input>
        </b-form-group>

        <b-form-group>
          <label class="col-form-label">Logo</label>
          <b-form-file v-model="objCompany.logo" accept="image/*" ref="file-input" @change="onFileChange" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..."></b-form-file>
        </b-form-group>

        <b-form-group>
          <label class="col-form-label">Website</label>
          <b-form-input v-model="objCompany.website" placeholder="http://www.domain.com" type="text"></b-form-input>
        </b-form-group>

        <template #modal-footer>
          <div class="w-100">
            <b-button variant="warning" size="md" @click="$root.$emit('bv::hide::modal', 'Add-Modal', $event.target)">Cancel</b-button>
            <b-button variant="primary" size="md" class="float-right" @click="saveCompany">Save</b-button>
          </div>
        </template>
      </b-modal>
      <!--/ Add Modal /-->
      <!--/ Edit Modal /-->
      <b-modal ref="Edit-Modal" id="Edit-Modal" no-close-on-backdrop centered title="Edit Company" @hide="resetModalFields">
        <b-form-group>
          <label class="col-form-label">Name</label>
          <b-form-input v-model="objCompany.name" placeholder="Company Name" type="text"></b-form-input>
        </b-form-group>

        <b-form-group>
          <label class="col-form-label">Email</label>
          <b-form-input v-model="objCompany.email" placeholder="email@domain.com" type="email"></b-form-input>
        </b-form-group>

        <b-form-group>
          <label class="col-form-label">Logo</label>
          <b-form-file v-model="objCompany.logo" accept="image/*" ref="file-input" @change="onFileChange" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..."></b-form-file>
        </b-form-group>

        <b-form-group>
          <label class="col-form-label">Website</label>
          <b-form-input v-model="objCompany.website" placeholder="http://www.domain.com" type="text"></b-form-input>
        </b-form-group>

        <template #modal-footer>
          <div class="d-flex justify-content-between w-100">
            <b-button variant="warning" size="md" @click="$root.$emit('bv::hide::modal', 'Edit-Modal', $event.target)">Cancel</b-button>
            <b-button variant="primary" size="md" @click="updateCompany(selected_company_id)">Update</b-button>
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
  name:"Company",
  components:{
    NavBar
  },
  data(){
    return{
      gridCompanies:{
        items:[],
        columns:[
          {
            key:"id",
            label: "Id",
          },
          {
            key:"name",
            label:"Name",
          },
          {
            key:"email",
            label:"Email",
          },
          {
            key:"website",
            label:"Website"
          },
          {
            key:"logo_preview",
            label:"Logo"
          },
          {
            key:'show_details',
            label:'Action'
          }
        ],
        totalRows:0,
        currentPage:1,
        perPage:10,
      },
      params:'',
      busy:false,
      objCompany:{
        name:"",
        email:"",
        logo:null,
        website:"",
      },
      isValidFileUploaded:null,
      selected_company_id:0,
    }
  },
  methods:{
    resetModalFields(){
      this.objCompany.name = "";
      this.objCompany.email = "";
      this.objCompany.logo = null;
      this.objCompany.website = "";
    },
    async onFileChange(e) {
      this.file = e.target.files[0];
      this.noFile = e.target.files.length;
      const photoUrl = URL.createObjectURL(this.file);
      const image = new Image();
      const imageDimensions = await new Promise((resolve) => {
        image.onload = () => {
          const dimensions = {
            height: image.height,
            width: image.width,
          };
          resolve(dimensions);
        };
        image.src = photoUrl;
      });
      this.$refs["file-input"].state = true;
      if (image.width < 100 && image.height < 100){
        Toast.fire({
          title: '<strong>Success</strong>',
          icon: 'success',
          html:'Image width 100px and height 100 required.',
          showCloseButton: true,
          showCancelButton: false,
        });
      }
    },
    async saveCompany(){
      let formData = new FormData();
      formData.append("name", this.objCompany.name);
      formData.append("email", this.objCompany.email);
      formData.append("website", this.objCompany.website);
      if (this.objCompany.logo !== null){
        formData.append("logo", this.objCompany.logo);
      }
      await AuthService.saveCompany(formData)
          .then((response) => {
            let responseData = response.data;
            if (responseData.status){
              Toast.fire({
                title: '<strong>Success</strong>',
                icon: 'success',
                html:responseData.message,
                showCloseButton: true,
                showCancelButton: false,
              });
              this.$refs["Add-Modal"].hide();
              this.getCompaniesGrid();
            }else{
              Toast.fire({
                title: '<strong>Message</strong>',
                icon: 'warning',
                html:responseData.message,
                showCloseButton: true,
                showCancelButton: false,
              });
            }
          })
          .catch((error) => {
            if (error.response.status == 422){
              let serverErrors = error.response.data;
              if (typeof serverErrors.errors !== 'undefined'){
                let message = '';
                for (let k in serverErrors.errors){
                  message += serverErrors.errors[k][0] + '<br/>';
                }
                Toast.fire({
                  title: '<strong>Validation Required</strong>',
                  icon: 'warning',
                  html:message,
                  showCloseButton: true,
                  showCancelButton: false,
                })
              }
            }
          });
    },
    async getCompaniesGrid(){
      let $this = this;
      this.busy = true;
      this.params = `?page=${$this.gridCompanies.currentPage}&limit=${$this.gridCompanies.perPage}`;
      await AuthService.getCompanies($this.params)
          .then(response => {
            const responseData = JSON.parse(JSON.stringify(response.data));
            $this.gridCompanies.totalRows = responseData.data.meta.total;
            $this.gridCompanies.currentPage = responseData.data.meta.current_page;
            $this.gridCompanies.perPage =  responseData.data.meta.per_page;
            $this.busy = false;
            $this.gridCompanies.items = responseData.data.data;
          })
          .catch(error => {
            console.log(error);
            this.busy = false;
            return [];
          });
    },
    async editCompany(idx, item, elm){
      await AuthService.getCompanyById(item.id)
          .then((response) => {
            let responseData = response.data;
            if (responseData.status){
              this.objCompany.name = responseData.data.name;
              this.objCompany.email = responseData.data.email;
              this.objCompany.website = responseData.data.website;
              this.$refs["Edit-Modal"].show();
              this.selected_company_id = responseData.data.id;
            }else{
              Toast.fire({
                title: '<strong>Message</strong>',
                icon: 'success',
                html:responseData.message,
                showCloseButton: true,
                showCancelButton: false,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },
    async updateCompany(companyId){
      let formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append("name", this.objCompany.name);
      formData.append("email", this.objCompany.email);
      formData.append("website", this.objCompany.website);
      if (this.objCompany.logo !== null){
        formData.append("logo", this.objCompany.logo);
      }
      await AuthService.updateCompany(companyId, formData)
          .then((response) => {
            let responseData = response.data;
            if (responseData.status){
              Toast.fire({
                title: '<strong>Success</strong>',
                icon: 'success',
                html:responseData.message,
              });
              this.$refs["Edit-Modal"].hide();
              this.$root.$emit('bv::refresh::table', 'gridCompanies');
              this.getCompaniesGrid();

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
              });
            }
          });
    },
    deleteCompany(idx, item, elm, row){
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
          await AuthService.deleteCompany(item.id)
              .then(response => {
                let responseData = response.data;
                if (responseData.status){
                  Toast.fire({
                    title: '<strong>Success</strong>',
                    icon: 'success',
                    html:responseData.message,
                    showCloseButton: true,
                    showCancelButton: false,
                  });
                  this.$root.$emit('bv::refresh::table', 'gridEmployees');
                  this.getCompaniesGrid();
                }else{
                  Toast.fire({
                    title: '<strong>Message</strong>',
                    icon: 'warning',
                    html:responseData.message,
                    showCloseButton: true,
                    showCancelButton: false,
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
    'gridCompanies.currentPage': {
      handler: function (value) {
        this.params = `page=${value}&size=${this.gridCompanies.perPage}`;
        this.getCompaniesGrid();
      },
    },
  },
  created() {
    this.getCompaniesGrid();
  }
}
</script>
