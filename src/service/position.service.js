import axiosIns from "@/plugins/axios"


const PositionService = new (class {
    async getPositionByCompanyId(companyId) {
        return await axiosIns.get(`/Position/Company/${companyId}`)
    }
    async createPosition(payload) {
        return await axiosIns.post("/Position/create", payload)
    }
    async updatePosition(positionId, payload) {
        return await axiosIns.post(`/Position/update/${positionId}`, payload)
    }
    async deletePosition(positionId) {
        return await axiosIns.delete(`/Position/delete/${positionId}`)
    }
})

export default PositionService
