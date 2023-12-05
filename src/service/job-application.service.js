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

    async myJobApplications() {
        return await axiosIns.get('/JobApplication/Applications/My')
    }
})

export default JobApplicationService
