import { defineStore } from "pinia";
import { merge, cloneDeep } from "lodash";

const defaultModel = () => ({
    title: "",
    description: "",
    slots: 1,
    skills: "",
    employment_type: "Full-Time",
    payment_type: "Monthly",
    salary_id: null,
    office_id: null,
    company_id: null
})

const usePositionStore = defineStore("Position", {
    state: () => ({
        positions: [],
        positionModel: defaultModel(),
        companyId: null,
    }),

    getters: {
        getPositions() {
            return this.positions
        },
        getPositionModel() {
            const model = cloneDeep(this.positionModel)

            if (!this.companyId) {
                console.warn("Company ID is not set")
            }

            model.company_id = this.companyId

            return model
        },
    },

    actions: {
        async initialize(positionArray) {
            this.positions = positionArray
        },
        async add(position) {
            this.positions.push(position)
        },
        async update(position) {
            merge(
                this.positions.find(p => p.id == position.id),
                position
            )
        },
        async delete(position) {
            this.positions = this.positions.filter(p => p.id != position.id)
        },
        async setCompany(companyId) {
            this.companyId = companyId
        },
        async setField(position) {
            this.positionModel = position
        },
        async resetField() {
            this.positionModel = defaultModel()
        },
    }

})

export default usePositionStore
