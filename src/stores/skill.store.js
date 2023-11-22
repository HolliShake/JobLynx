import { defineStore } from "pinia";
import { merge, cloneDeep } from "lodash";

const defaultModel = () => ({
    title: '',
    description: '',
    progress: 0,
    user_id: null,
})

const useSkillStore = defineStore("Skill", {
    state: () => ({
        skills: [],
        skillModel: defaultModel(),
        userId: null,
    }),

    getters: {
        getSkills() {
            return this.skills;
        },
        getSkillModel() {
            if (!this.userId) {
                console.warn("user id was not set!!!")
            }

            const model = cloneDeep(this.skillModel);
            model.user_id = this.userId;
            return model;
        },
    },

    actions: {
        initialize(skills) {
            this.skills = skills;
        },
        add(skill) {
            this.skills.push(skill);
        },
        update(skill) {
            merge(
                this.skills.find((s) => s.id == skill.id),
                skill,
            )
        },
        delete(skill) {
            this.skills = this.skills.filter((s) => s.id != skill.id);
        },
        setUser(userId) {
            this.userId = userId;
        },
        setField(skill) {
            this.skillModel = skill;
        },
        resetField() {
            this.skillModel = defaultModel();
        }
    },
})

export default useSkillStore;
