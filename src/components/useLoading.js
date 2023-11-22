import { defineStore } from "pinia"



const useLoading = defineStore('Loading', {
  state: () => ({
    isLoading: false,
  }),
    
  actions: {
    async setLoading(loadingState) {
      this.isLoading = loadingState
    },
  },
})


export default useLoading


