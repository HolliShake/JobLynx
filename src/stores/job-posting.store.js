import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  date_posted: new Date(Date.now()),
  is_hide_company_info: false,
  is_hidden: false,
  paid: false,
  description: "",

  // 
  adtype_id: null,
  position_id: -1,
})

const useJobPostingStore = defineStore("JobPosting", {

  state: () => ({
    jobPostings: [],
    jobPostingModel: defaultModel(),
  }),

  getters: {
    getJobPostings() {
      return this.jobPostings
    },
    getJobPostingModel() {
      return cloneDeep(this.jobPostingModel)
    },
  },

  actions: {
    initialize(jobPostingArray) {
      this.jobPostings = jobPostingArray
    },
    add(jobPosting) {
      this.jobPostings.push(jobPosting)
    },
    update(jobPosting) {
      merge(
        this.jobPostings.find(j => j.id == jobPosting.id),
        jobPosting,
      )
    },
    delete(jobPosting) {
      this.jobPostings = this.jobPostings.filter(j => j.id != jobPosting.id)
    },
    setField(jobPosting) {
      this.jobPostingModel = jobPosting
    },
    resetField() {
      this.jobPostingModel = defaultModel()
    },
  },
})

export default useJobPostingStore
