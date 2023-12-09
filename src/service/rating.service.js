import axiosIns from "@/plugins/axios"

const RatingService = new (class {
    async getSampleRatingByCompanyId(company_id) {
        return await axiosIns.get(`/Rating/Sample/Company/${company_id}`)
    }

    async getMyRatingByCompanyId(companyId) {
        return await axiosIns.get(`/Rating/Company/${companyId}`)
    }

    async submitMyComment(payload) {
        return await axiosIns.post('/Rating/comment', payload)
    }
})

export default RatingService
