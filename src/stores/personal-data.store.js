import { defineStore } from "pinia";
import { merge, cloneDeep } from "lodash";

const usePersonalDataStore = defineStore("PersonalData", {
    state: () => ({
        personalData: {},
    }),

    getters: {
        getPersonalData() {
            return cloneDeep(this.personalData)
        }
    },

    actions: {
        initialize(personalData) {
            return this.personalData = personalData
        },
        update(personalData) {
            merge(
                this.personalData,
                personalData
            )
        }
    }
})

export default usePersonalDataStore

