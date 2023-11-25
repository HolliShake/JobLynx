import axiosIns from "@/plugins/axios"

const OfficeService = new (class {
    async getOfficesByCampusId(campusId) {
        return await axiosIns.get(`/Office/Company/${campusId}`)
    }
    async getOffice(officeId) {
        return await axiosIns.get(`/Office/${officeId}`)
    }
    async createOffice(payload) {
        return await axiosIns.post('/Office/create', payload)
    }
    async updateOffice(officeId, payload) {
        return await axiosIns.put(`/Office/update/${officeId}`, payload)
    }
    async deleteOffice(officeId) {
        return await axiosIns.delete(`/Office/delete/${officeId}`)
    }
})

export default OfficeService
