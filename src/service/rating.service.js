import axiosIns from "@/plugins/axios"

const RatingService = new (class {
    async getSampleRatingByCompanyId(company_id) {
        return axiosIns.get(`/Rating/Sample/Company/${company_id}`)
    }
})

export default RatingService
