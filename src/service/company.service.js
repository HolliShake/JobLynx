import axiosIns from "@/plugins/axios"


const CompanyService = new (class {
    async getAllCompanies() {
        return await axiosIns.get('/Company/all')
    }
    async getCompanyById(companyId) {
        return await axiosIns.get(`/Company/${companyId}`)
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
    async getAllPublicCompanies() {
        return await axiosIns.get('/Company/Public/all')
    }
    async getSampleCompanies() {
        return await axiosIns.get('/Company/Public/sample')
    }
})

export default CompanyService

