import { cloneDeep } from "lodash";
import { defineStore } from "pinia";

const defaultModel = () => ({
    first_name: "",
    last_name: "",
    middle_name: "",
    suffix: "",
    gender: "male",
    country: "Philippines",
    address: "",
    birth_date: "",
    mobile_number: "",
    email: "",
    password: "",
})

const useAuthStore = defineStore("Auth", {
    state: () => {
        let userData = null

        try 
        {
            if (localStorage.getItem("userData")) {
                userData = JSON.parse(localStorage.getItem("userData"))
            }
        } catch (error) {
            console.log(error)
        }

        return ({
            userData: (userData || {}),
            userModel: defaultModel(),
        })
    },

    getters: {
        getUserData() {
            return cloneDeep(this.userData)
        },
        isLoggedIn() {
            return !!this.userData.id
        },
        isAdmin() {
            if (!this.isLoggedIn) return false

            const access = this.userData.user_access.map(ua => ({ subject: ua.subject, action: ua.action }))

            const all = access.find(a => a.subject == "admin")

            if (!all) {
                return false
            }

            return (!!all) && this.userData.role == 'admin'
        },
        isCompany() {
            if (!this.isLoggedIn) return false

            const access = this.userData.user_access.map(ua => ({ subject: ua.subject, action: ua.action }))

            const all = access.find(a => a.subject == "company")

            if (!all) {
                return false
            }

            return (!!all) && this.userData.role == 'company'
        },
        isUser() {
            if (!this.isLoggedIn) return false

            const access = this.userData.user_access.map(ua => ({ subject: ua.subject, action: ua.action }))

            const all = access.find(a => a.subject == "user")

            if (!all) {
                return false
            }

            return (!!all) && this.userData.role == 'user'
        },
        isAccountsetuped() {
            if (!this.isLoggedIn) return false

            return !!this.userData.personal_data
        },
        getUserModel() {
            return this.userModel
        }
    },

    actions: {
        save(userDataFromResponse) {
            localStorage.setItem("accessToken", userDataFromResponse.accessToken)
            localStorage.setItem("userAbilities", JSON.stringify(userDataFromResponse.user_access.map(ua => ({ subject: ua.subject, action: ua.action }))))
            localStorage.setItem("userData", JSON.stringify(userDataFromResponse))
            this.userData = userDataFromResponse
        },
        update(userDataFromResponse) {
            this.userData = { ...this.userData, ...userDataFromResponse }
            localStorage.setItem("userData", JSON.stringify(this.userData))
        },
        clearCache() {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("userAbilities")
            localStorage.removeItem("userData")
        },
        patch(payload) {
            this.userData = { ...this.userData, ...payload }
            localStorage.setItem("userData", JSON.stringify(this.userData))
        }
    }
})

export default useAuthStore
