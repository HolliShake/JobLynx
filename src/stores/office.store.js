import { defineStore } from "pinia";
import { cloneDeep, merge } from "lodash"

const defaultModel = () => ({
    name: "",
    description: "",
    country: "",
    address: "",
    company_id: null,
})

const useOfficeStore = defineStore("Office", {
    state: () => ({
        offices: [],
        officeModel: defaultModel(),
        companyId: null,
    }),

    getters: {
        getOffices() {
            return this.offices;
        },
        getOfficeModel() {
            const model = cloneDeep(this.officeModel)

            if (!this.companyId) {
                console.warn("No company id set for office model")
            }

            model.company_id = this.companyId

            return model;
        },
    },

    actions: {
        initialize(officeArray) {
            this.offices = officeArray;
        },
        add(office) {
            this.offices.push(office)
        },
        update(office) {
            merge(
                this.offices.find(o => o.id == office.id),
                office
            )
        },
        delete(office) {
            this.offices = this.offices.filter(o => o.id != office.id)
        },
        setCompany(id) {
            this.companyId = id
        },
        setField(office) {
            this.officeModel = office
        },
        resetField() {
            this.officeModel = defaultModel()
        },
    }
})

export default useOfficeStore;
