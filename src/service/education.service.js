import axiosIns from "@/plugins/axios"


const EducationService = new (class {
    async getEducations() {
        return await axiosIns.get('/Education/all')
    }
    async getEducationsByUser(userId) {
        return await axiosIns.get(`/Education/User/${userId}`)
    }
    async getMyEducations() {
        return await axiosIns.get('/Education/My')
    }
    async getEducation(educationId) {
        return await axiosIns.get(`/Education/${educationId}`)
    }
    async createEducation(payload) {
        return await axiosIns.post('/Education/create', payload)
    }
    async updateEducation(educationId, payload) {
        return await axiosIns.put(`/Education/update/${educationId}`, payload)
    }
    async deleteEducation(educationId) {
        return await axiosIns.delete(`/Education/delete/${educationId}`)
    }
})

export default EducationService
