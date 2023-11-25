import { make } from "../mapper.js"

export default Object.freeze(make([
    {
        title: 'Companies',
        to: { name: 'admin-companies' },
        icon: { icon: 'tabler-building' },
    },
    {
        title: 'Ad Types',
        to: { name: 'admin-ad-types' },
        icon: { icon: 'tabler-ticket' },
    },
]))
