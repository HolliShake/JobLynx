import axiosIns from "@/plugins/axios"


const JobApplicationService = new (class {
    async getById(id) {
        return await axiosIns.get(`/JobApplication/${id}`)
    }
    async applyJobPost(jobPostingId) {
        return await axiosIns.post(`/JobApplication/apply/${jobPostingId}`)
    }

    async getJobApplicantsByJobPostingId(jobPostingId) {
        return await axiosIns.get(`/JobApplication/JobPosting/${jobPostingId}`)
    }

    async getJobApplicantsByCompanyId(companyId) {
        return await axiosIns.get(`/JobApplication/Dashboard/Company/${companyId}`)
    }

    async myJobApplications() {
        return await axiosIns.get('/JobApplication/Applications/My')
    }

    async myPendingJobApplicationsByJobPostingId(jobPostingId) {
        return await axiosIns.get(`/JobApplication/Applications/My/JobPosting/${jobPostingId}`)
    }

    async approve(jobApplicationId) {
        return await axiosIns.patch(`/JobApplication/approve/${jobApplicationId}`, { id: jobApplicationId, status: 'accepted' })
    }
    
    async reject(jobApplicationId) {
        return await axiosIns.patch(`/JobApplication/reject/${jobApplicationId}`, { id: jobApplicationId, status: 'rejected' })
    }

    async cancel(jobApplicationId) {
        return await axiosIns.delete(`/JobApplication/cancel/${jobApplicationId}`)
    }
})

export default JobApplicationService
