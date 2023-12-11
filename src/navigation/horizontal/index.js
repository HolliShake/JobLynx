import { make } from "../mapper.js"

export default Object.freeze([
    ...make([
        { 
            heading: 'Company Management',
            auth: true,
        },
        {
            title: 'Dashboard',
            to: { name: 'company-companyid-dashboard' },
            icon: { icon: 'tabler-layout-dashboard' },
            auth: true,
        },
        {
            title: 'My Offices',
            to: { name: 'company-companyid-office' },
            icon: { icon: 'tabler-building' },
            auth: true,
        },
        {
            title: 'Employees',
            to: { name: 'company-companyid-employees' },
            icon: { icon: 'tabler-users-group' },
            auth: true,
        },
        {
            title: 'Job Posting',
            to: { name: 'company-companyid-job-posting' },
            icon: { icon: 'tabler-briefcase' },
            auth: true,
        },
        {
            title: 'Job Position',
            to: { name: 'company-companyid-position' },
            icon: { icon: 'tabler-tie' },
            auth: true,
        },
        {
            title: 'Salary Item',
            to: { name: 'company-companyid-salary' },
            icon: { icon: 'tabler-cash' },
            auth: true,
        },
    ]),
    // =====================================
    { 
        heading: 'Administration',
        subject: 'admin',
        action: 'read',
        auth: true,
    },
    {
        title: 'Companies',
        to: { name: 'admin-companies' },
        icon: { icon: 'tabler-building' },
        subject: 'admin',
        action: 'read',
        auth: true,
    },
    {
        title: 'Ad Types',
        to: { name: 'admin-ad-types' },
        icon: { icon: 'tabler-ticket' },
        subject: 'admin',
        action: 'read',
        auth: true,
    },
])
