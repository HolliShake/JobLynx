import { defineStore } from "pinia";
import { merge, cloneDeep } from "lodash";

const defaultModel = () => ({
    title: "",
    level: "",
    value: 0,
    currency: "",
    company_id: null
})

const useSalaryStore = defineStore("Salary", {

    state: () => ({
        salaries: [],
        salaryModel: defaultModel(),
        companyId: null,
    }),

    getters: {
        getSalaries() {
            return this.salaries
        },
        getSalaryModel() {
            const model = cloneDeep(this.salaryModel)

            if (!this.companyId) {
                console.warn("Company ID is not set")
            }

            model.company_id = this.companyId

            return model
        },
    },

    actions: {
        initialize(salaryArray) {
            this.salaries = salaryArray
        },
        add(salary) {
            this.salaries.push(salary)
        },
        update(salary) {
            merge(
                this.salaries.find(s => s.id == salary.id),
                salary
            )
        },
        delete(salary) {
            this.salaries = this.salaries.filter(s => s.id != salary.id)
        },
        setCompany(companyId) {
            this.companyId = companyId
        },
        setField(salary) {
            this.salaryModel = salary
        },
        resetField() {
            this.salaryModel = defaultModel()
        },
    }

})

export default useSalaryStore
