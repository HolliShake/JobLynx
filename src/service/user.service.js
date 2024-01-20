import axiosIns from "@/plugins/axios"


const UserService = new (class {
  async updateUser(userId, payload) {
    return await axiosIns.put(`/User/update/${userId}`, payload)
  }
  async deleteuser(userId) {
    return await axiosIns.delete(`/User/delete/${userId}`)
  }
  async getResumeById(userId) {
    return await axiosIns.get(`/User/Resume/${userId}`)
  }
  async getAllExceptCurrent() {
    return await axiosIns.get(`/User/all/exceptcurrent`)
  }
  async acceptUser(userId) {
    return await axiosIns.patch(`/User/verify/${userId}`)
  }
})

export default UserService
