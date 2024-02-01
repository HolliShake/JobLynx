import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  title: "",
  level: "",
  value: 0,
  currency: "",
})

const useSalaryStore = defineStore("Salary", {

  state: () => ({
    salaries: [],
    salaryModel: defaultModel(),

    // companyId: null,
  }),

  getters: {
    getSalaries() {
      return this.salaries
    },
    getSalaryModel() {
      //   if (!this.companyId) {
    //     console.warn("Company ID is not set")
    //   }

      //   model.company_id = this.companyId

      return cloneDeep(this.salaryModel)
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
        salary,
      )
    },
    delete(salary) {
      this.salaries = this.salaries.filter(s => s.id != salary.id)
    },

    // setCompany(companyId) {
    //   this.companyId = companyId
    // },
    setField(salary) {
      this.salaryModel = salary
    },
    resetField() {
      this.salaryModel = defaultModel()
    },
  },

})

export default useSalaryStore
