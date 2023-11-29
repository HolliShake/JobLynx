import axiosIns from "@/plugins/axios"

const JobPostingService = new (class {
    async getJobPostingByCompanyId(companyId) {
        return await axiosIns.get(`/JobPosting/Company/${companyId}`)
    }
    async createJobPosting(payload) {
        return await axiosIns.post('/JobPosting/create', payload)
    }
    async updateJobPosting(jobPotingId, payload) {
        return await axiosIns.post(`/JobPosting/update/${jobPotingId}`, payload)
    }
    async deleteJobPosting(jobPostingId) {
        return await axiosIns.delete(`/JobPosting/delete/${jobPostingId}`)
    }
    // 
    async markAsPaid(jobPostingId) {
        return await axiosIns.patch(`/JobPosting/status/${jobPostingId}`, { id: jobPostingId , paid: true })
    }
})

export default JobPostingService

