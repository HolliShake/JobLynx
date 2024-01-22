import axiosIns from "@/plugins/axios"


const CompanyService = new (class {
  async getAllCompanies() {
    return await axiosIns.get('/Company/all')
  }
  async getAllPartnerCompanies() {
    return await axiosIns.get('/Company/partners/all')
  }
  async getCompanyById(companyId) {
    return await axiosIns.get(`/Company/${companyId}`)
  }
  async getDefaultCompany() {
    return await axiosIns.get('/Company/default')
  }
  async getCompaniesByUserId(userId) {
    return await axiosIns.get(`/Company/User/${userId}`)
  }
  async getMyCompanies() {
    return await axiosIns.get('/Company/My')
  }
  async createCompany(payload) {
    return await axiosIns.post('/Company/create', payload)
  }
  async updateCompany(companyId, payload) {
    return await axiosIns.put(`/Company/update/${companyId}`, payload)
  }
  async deleteCompany(companyId) {
    return await axiosIns.delete(`/Company/delete/${companyId}`)
  }

  // 
  async accept(companyId) {
    return await axiosIns.patch(`/Company/accept/${companyId}`)
  }

  async reject(companyId) {
    return await axiosIns.patch(`/Company/reject/${companyId}`)
  }
  
  // 
  async getAllPublicCompanies() {
    return await axiosIns.get('/Company/Public/all')
  }
  async getSampleCompanies() {
    return await axiosIns.get('/Company/Public/sample')
  }
})

export default CompanyService

