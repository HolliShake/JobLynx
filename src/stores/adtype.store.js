import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  type: "",
  price: 0,
  post_date: "",
  duration: 1,
  max_skills_matching: 0,
  is_search_priority: false,
  is_featured: false,
  is_analytics_available: false,
  is_editable: false,
})

const useAdTypeStore = defineStore("AdType", {
  state: () => ({
    adtypes: [],
    adtypeModel: {},
  }),

  getters: {
    getAdTypes() {
      return this.adtypes
    },
    getAdTypeModel() {
      return cloneDeep(this.adtypeModel)
    },
  },

  actions: {
    initialize(addtypesArray) {
      this.adtypes = addtypesArray
    },
    add(adtype) {
      this.adtypes.push(adtype)
    },
    update(adtype) {
      merge(
        this.adtypes.find(item => item.id == adtype.id),
        adtype,
      )
    },
    delete(adtype) {
      this.adtypes = this.adtypes.filter(item => item.id != adtype.id)
    },
    setField(field) {
      this.adtypeModel = field
    },
    resetField() {
      this.adtypeModel = defaultModel()
    },
  },
})

export default useAdTypeStore
