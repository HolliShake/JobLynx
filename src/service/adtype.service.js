import axiosIns from "@/plugins/axios";


const AdTypeService = new (class {
    async getAllAdtypes() {
        return await axiosIns.get("/Adtype/all");
    }
    async getAdtypeById(adtypeId) {
        return await axiosIns.get(`/Adtype/${adtypeId}`);
    }
    async createAdtype(payload) {
        return await axiosIns.post("/Adtype/create", payload);
    }
    async updateAdtype(adtypeId, payload) {
        return await axiosIns.put(`/Adtype/update/${adtypeId}`, payload);
    }
    async deleteAdtype(adtypeId) {
        return await axiosIns.delete(`/Adtype/delete/${adtypeId}`);
    }
})

export default AdTypeService;
