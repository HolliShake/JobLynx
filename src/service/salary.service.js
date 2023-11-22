import axiosIns from "@/plugins/axios"


const SalaryService = new (class {
    async getSalaryByCompanyId(companyId) {
        return await axiosIns.get(`/Salary/Company/${companyId}`)
    }
    async createSalary(payload) {
        return await axiosIns.post('/Salary/create', payload)
    }
})

export default SalaryService
