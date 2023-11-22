import { defineStore } from "pinia";


const useRawLayout = defineStore("RawLayout", {

    state: () => ({
        is_layout_fluid: false,        
    }),

    getters: {
        isLayoutFluid() {
            return this.is_layout_fluid;
        },
    },

    actions: {
        setLayoutFluid(isLayoutFluid) {
            return (this.is_layout_fluid = isLayoutFluid);
        },
    }

})

export default useRawLayout
