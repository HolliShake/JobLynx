import axiosIns from "@/plugins/axios"


const ApplicationLogService = new (class {
    async createLog(payload) {
        return await axiosIns.post('/ApplicationLogs/create', payload)
    }
    async updateLog(applicationLogId, payload) {
        return await axiosIns.put(`/ApplicationLogs/update/${applicationLogId}`, payload)
    }
    async deleteLog(applicationLogId) {
        return await axiosIns.delete(`/ApplicationLogs/delete/${applicationLogId}`)
    }
    async score(applicationLogId, payload) {
        return await axiosIns.patch(`/ApplicationLogs/score/${applicationLogId}`, payload)
    }
})


export default ApplicationLogService
