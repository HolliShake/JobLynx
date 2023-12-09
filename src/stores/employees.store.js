import { defineStore } from "pinia";


const useEmployees = defineStore('Employees', {

    state: () => ({
        employees: [],
    }),

    getters: {
        getEmployees() {
            return this.employees
        }
    },

    actions: {
        async initialize(employeeArray) {
            this.employees = employeeArray
        },

        async delete(employee) {
            this.employees = this.employees.filter(e => e.id != employee.id)
        },
    },

})

export default useEmployees
