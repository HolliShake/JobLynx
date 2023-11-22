import axiosIns from "@/plugins/axios";


export default new (class {
    async authenticate() {
        return await axiosIns.get("/user");
    }
    async login(payload) {
        return await axiosIns.post("/Auth/login", payload);
    }
    async register(payload) {
        return await axiosIns.post("/Auth/register", payload);
    }
});

