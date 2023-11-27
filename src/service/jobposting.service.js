import axiosIns from "@/plugins/axios"

const JobPostingService = new (class {
    async getJobPostingByCompanyId(companyId) {
        return await axiosIns.get(`/JobPosting/Company/${companyId}`)
    }
    async createJobPosting(payload) {
        return await axiosIns.post('/JobPosting/create', payload)
    }

    async updateJobPosting(payload) {
        return await axiosIns.put('/JobPosting/update', payload)
    }
    async deleteJobPosting(jobPostingId) {
        return await axiosIns.delete(`/JobPosting/delete/${jobPostingId}`)
    }
})

export default JobPostingService

