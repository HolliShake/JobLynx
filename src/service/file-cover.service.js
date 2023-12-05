import axiosIns from "@/plugins/axios"


const FileCoverService = new (class {
    async changeCoverImage(payload) {
        return axiosIns.post('/FileCover/Change', payload)
    }
})

export default FileCoverService
