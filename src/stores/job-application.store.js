import { defineStore } from "pinia";

const defaultModel = () => ({

})

const useJobApplicationStore = defineStore("JobApplication", {

    state: () => ({
        jobApplications: [],
    }),

    getters: {
        getJobApplications() {
            return this.jobApplications
        }
    },

    actions: {
        async initialize(jobApplicationArray) {
            this.jobApplications = jobApplicationArray
        },
        async add(jobApplication) {
            this.jobApplications.push(jobApplication)
        },
        async delete(jobApplication) {
            this.jobApplications = this.jobApplications.filter(ja => ja.id !== jobApplication.id)
        }
    }

})

export default useJobApplicationStore
