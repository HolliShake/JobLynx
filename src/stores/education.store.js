import { defineStore } from "pinia";
import { cloneDeep, merge } from "lodash";

const defaultModel = () => ({
    school_name: "",
    status: "graduated",
    location: "",
    description: "",
    start_sy: new Date(Date.now()),
    end_sy: new Date(Date.now()),
    user_id: null,
})

const useEducationStore = defineStore("Education", {

    state: () => ({
        educations: [],
        educationModel: defaultModel(),
        userId: null,
    }),

    getters: {
        getEducation() {
            return this.educations;
        },
        getEducationModel() {
            const model = cloneDeep(this.educationModel)

            if (!this.userId) {
                console.warn("No user id found")
            }

            model.user_id = this.userId

            return model
        },
    },

    actions: {
        initialize(educationArray) {
            this.educations = educationArray
        },
        add(education) {
            this.educations.push(education)
        },
        update(education) {
            merge(
                this.educations.find((item) => item.id === education.id),
                education
            )
        },
        delete(education) {
            this.educations = this.educations.filter(
                (item) => item.id !== education.id
            )
        },
        setUser(userId) {
            this.userId = userId
        },
        setField(education) {
            this.educationModel = education
        },
        resetField() {
            this.educationModel = defaultModel()
        },
    }

})

export default useEducationStore
