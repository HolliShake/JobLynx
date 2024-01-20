import { merge } from "lodash"
import { defineStore } from "pinia"

const useUserStore = defineStore('UserStore', {
  state: () => ({
    users: [],
  }),
  getters: {
    getUsers: state => state.users,
  },
  actions: {
    initialize(usersArray) {
      this.users = usersArray
    },
    update(user) {
      merge(
        this.users.find(u => u.id == user.id),
        user,
      )
    },
    delete() {
      this.users = this.users.filter(u => u.id != user.id)
    },
  },
})

export default useUserStore
