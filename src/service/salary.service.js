import axiosIns from "@/plugins/axios"


const SalaryService = new (class {
  async getAllSalary() {
    return await axiosIns.get("/Salary/all")
  }
  async getSalaryByCompanyId(companyId) {
    return await axiosIns.get(`/Salary/Company/${companyId}`)
  }
  async createSalary(payload) {
    return await axiosIns.post('/Salary/create', payload)
  }
  async updateSalary(salarydId, payload) {
    return await axiosIns.put(`/Salary/update/${salarydId}`, payload)
  }
  async deleteSalary(salarydId) {
    return await axiosIns.delete(`/Salary/delete/${salarydId}`)
  }
})

export default SalaryService
