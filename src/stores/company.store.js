import { cloneDeep, merge } from 'lodash'
import { defineStore } from "pinia"
import useAuthStore from "./auth.store"

const defaultModel = () => ({
  company_name: '',
  email: '',
  description: '',
  address: '',
  status: 'active',
  user_id: null,
})


const useCompanyStore = defineStore("Company", {

  state: () => ({
    companies: [],
    companyModel: defaultModel(),
    userId: null,
  }),

  getters: {
    getCompanies() {
      return this.companies
    },
    getCompanyModel() {
      const model = cloneDeep(this.companyModel)

      if (!this.userId) {
        console.warn('No userId set in Company store')
      } else {
        model.user_id = this.userId
      }

      return model
    },
    getCompanyModelAsContext() {
      const authStore = useAuthStore()

      const model = cloneDeep(this.companyModel)

      model.user_id = authStore.getUserData.id
      
      return model
    },
  },

  actions: {
    initialize(companyArray) {
      this.companies = companyArray
    },
    add(company) {
      this.companies.push(company)
    },
    update(company) {
      merge(
        this.companies.find(c => c.id == company.id),
        company,
      )
    },
    delete(company) {
      this.companies = this.companies.filter(c => c.id != company.id)
    },
    setUser(userId) {
      this.userId = userId
    },
    setField(company) {
      this.companyModel = company
    },
    resetField() {
      this.companyModel = defaultModel()
    },
  },

})

export default useCompanyStore
