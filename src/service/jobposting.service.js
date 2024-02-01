import axiosIns from "@/plugins/axios"

const JobPostingService = new (class {
  async getJobPostingByCompanyId(companyId) {
    return await axiosIns.get(`/JobPosting/Company/${companyId}`)
  }

  async getApprovedJobPostingByCompanyId(companyId) {
    return await axiosIns.get(`/JobPosting/Public/Company/${companyId}`)
  }

  async getJobPostingById(jobPostingId) { 
    return await axiosIns.get(`/JobPosting/Public/${jobPostingId}`)
  }
  async getAllJobPosting() { 
    return await axiosIns.get(`/JobPosting/Public/all`)
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
    return await axiosIns.patch(`/JobPosting/status/${jobPostingId}`, { id: jobPostingId, paid: true })
  }

  async acceptJobPosting(jobPostingId) {
    return await axiosIns.patch(`/JobPosting/status/${jobPostingId}`, { id: jobPostingId, status: 'approved' })
  }

  async rejectJobPosting(jobPostingId) {
    return await axiosIns.patch(`/JobPosting/status/${jobPostingId}`, { id: jobPostingId, status: 'rejected' })
  }

  // 
  async getSampleFeaturedJobPosting() {
    return await axiosIns.get('/JobPosting/Public/featured/sample')
  }
})

export default JobPostingService

