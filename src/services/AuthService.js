import api from "./api";

class AuthService {
    login(credentials) {
        return api.post('login', credentials);
    }
    logout(formData){
      return api.post('logout/', formData);
    }
    getAllCompanies(){
        return api.get('companies/all');
    }
    getCompanies(params){
        return api.get('companies' + params);
    }
    saveCompany(formData){
        return api.post('companies', formData);
    }
    getCompanyById(companyId){
      return api.get('companies/' + companyId);
    }
    updateCompany(companyId, formData){
        return api.post("companies/" + companyId, formData);
    }
    deleteCompany(companyId){
        return api.delete('companies/' + companyId);
    }

    getEmployees(params){
        return api.get( 'employees' + params );
    }
    saveEmployee(formData){
        return api.post( 'employees', formData);
    }
    getEmployeeById(employeeId){
      return api.get( 'employees/'+ employeeId);
    }
    updateEmployee(employeeId, formData){
        return api.post("employees/" + employeeId, formData);
    }
    deleteEmployee(employeeId){
        return api.delete('employees/' + employeeId);
    }
}
export default new AuthService();