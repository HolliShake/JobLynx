import axiosIns from "@/plugins/axios"

const PersonalDataService = new (class {
    async getMyPersonalData() {
        return await axiosIns.get('/PersonalData/My')
    }
    async updatePersonalData(personalDataId, payload) {
        return await axiosIns.put(`/PersonalData/update/${personalDataId}`, payload)
    }
})

export default PersonalDataService

