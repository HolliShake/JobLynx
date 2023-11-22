import axiosIns from "@/plugins/axios"

const SkillService  = new (class {
    async getSkills() {
        return await axiosIns.get('/Skill/all')
    }
    async getSkillsByUser(userId) {
        return await axiosIns.get(`/Skill/User/${userId}`)
    }
    async getMySkills() {
        return await axiosIns.get('/Skill/My')
    }
    async getSkill(skillId) {
        return await axiosIns.get(`/Skill/${skillId}`)
    }
    async createSkill(payload) {
        return await axiosIns.post('/Skill/create', payload)
    }
    async updateSkill(skillId, payload) {
        return await axiosIns.put(`/Skill/update/${skillId}`, payload)
    }
    async deleteSkill(skillId) {
        return await axiosIns.delete(`/Skill/delete/${skillId}`)
    }
})

export default SkillService
