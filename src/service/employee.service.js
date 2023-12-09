import axiosIns from "@/plugins/axios"


const EmployeeService = new (class {
    async getEmployeesByCompanyId(companyId) {
        return await axiosIns.get(`/Employee/Company/${companyId}`)
    }

    async deleteEmployee(hiredApplicantId) {
        return await axiosIns.delete(`/Employee/Delete/${hiredApplicantId}`)
    }
})

export default EmployeeService
