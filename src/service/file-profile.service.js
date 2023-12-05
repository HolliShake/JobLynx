import axiosIns from "@/plugins/axios"


const FileProfileService = new (class {
    async changeProfileImage(payload) {
        return axiosIns.post('/FileProfile/Change', payload)
    }
})

export default FileProfileService
