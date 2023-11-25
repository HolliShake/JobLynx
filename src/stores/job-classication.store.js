import { defineStore } from "pinia";
import { merge, cloneDeep } from "lodash"

const defaultModel = () => ({
    description: "",
    position: "",
    slots: 0,
    salary_id: 0,
    company_id: null
})

const useJobClassificationStore = defineStore("JobClassicationStore", {

    state: () => ({
        jobClassifications: [],
        jobClassificationModel: defaultModel(),
        companyId: null
    }),

    getters: {
        getJobClassifications() {
            return this.jobClassifications
        },
        getJobClassificationModel() {
            const model = this.jobClassificationModel

            if (!this.companyId) {
                console.warn("No company id set for job classification model")
            }

            model.company_id = this.companyId

            return model
        },
    }, 

    actions: {
        initialize(jobClassificationArray) {
            this.jobClassifications = jobClassificationArray
        },
        add(jobClassification) {
            this.jobClassifications.push(jobClassification)
        },
        update(jobClassification) {
            merge(
                this.jobClassifications.find(jc => jc.id == jobClassification.id),
                jobClassification
            )
        },
        delete(jobClassification) {
            this.jobClassifications = this.jobClassifications.filter(jc => jc.id != jobClassification.id)
        },
        setCompany(companyId) {
            this.companyId = companyId
        },
        setField(jobClassification) {
            this.jobClassificationModel = jobClassification
        },
        resetField() {
            this.jobClassificationModel = defaultModel()
        },
    }

})

export default useJobClassificationStore
