import axiosIns from "@/plugins/axios";


const UserService = new (class {
    async updateUser(userId, payload) {
        return await axiosIns.put(`/User/update/${userId}`, payload);
    }
    async deleteuser(userId) {
        return await axiosIns.delete(`/User/delete/${userId}`);
    }
})

export default UserService
