import { make } from "../mapper.js"

export default Object.freeze([
    ...make([
        { 
            heading: 'Company Management',
        },
        {
            title: 'Dashboard',
            to: { name: 'company-companyid-dashboard' },
            icon: { icon: 'tabler-layout-dashboard' },
        },
        {
            title: 'My Offices',
            to: { name: 'company-companyid-office' },
            icon: { icon: 'tabler-building' },
        },
        {
            title: 'Employees',
            to: { name: 'company-companyid-employees' },
            icon: { icon: 'tabler-users-group' },
        },
        {
            title: 'Job Posting',
            to: { name: 'company-companyid-job-posting' },
            icon: { icon: 'tabler-briefcase' },
        },
        {
            title: 'Job Position',
            to: { name: 'company-companyid-position' },
            icon: { icon: 'tabler-tie' },
        },
        {
            title: 'Salary Item',
            to: { name: 'company-companyid-salary' },
            icon: { icon: 'tabler-cash' },
        },
    ]),
    // =====================================
    { 
        heading: 'Administration',
        subject: 'admin',
        action: 'read',
    },
    {
        title: 'Companies',
        to: { name: 'admin-companies' },
        icon: { icon: 'tabler-building' },
        subject: 'admin',
        action: 'read',
    },
    {
        title: 'Ad Types',
        to: { name: 'admin-ad-types' },
        icon: { icon: 'tabler-ticket' },
        subject: 'admin',
        action: 'read',
    },
])
