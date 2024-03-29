import { make } from "../mapper.js"


const company_paths = [
    
]

export default Object.freeze([
  ...make('company', [
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

  ...make('admin', [
    { 
      heading: 'Manage Starboard',
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
    { 
      heading: 'Administration',
    },
    {
      title: 'Ad Types',
      to: { name: 'admin-companyid-ad-types' },
      icon: { icon: 'tabler-ticket' },
      auth: true,
    },
    {
      title: 'Companies',
      to: { name: 'admin-companyid-companies' },
      icon: { icon: 'tabler-building' },
      auth: true,
    },
    {
      title: 'Users',
      to: { name: 'admin-companyid-users' },
      icon: { icon: 'tabler-users' },
      auth: true,
    },
  ]),
])

// admin.jobhunt.dev@gmail.com
