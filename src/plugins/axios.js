import useLoading from '@/components/useLoading'
// eslint-disable-next-line regex/invalid
import axios from 'axios'
import router from '../router'

const axiosIns = axios.create({
// You can add your headers here
// ================================
  baseURL: import.meta.env.VITE_APP_API_URL,

  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})


// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use(config => {
  // Enable global loading
  if (["post", "put", "patch", "delete"].includes(config.method?.toLowerCase())) useLoading().setLoading(true)

  // Retrieve token from localStorage
  const token = localStorage.getItem('accessToken')

  // If token is found
  if (token) {
    // Get request headers and if headers is undefined assign blank object
    config.headers = config.headers || {}

    // Set authorization header
    // ℹ️ JSON.parse will convert token to string
    config.headers.Authorization = token ? `Bearer ${token}` : ''
  }

  // Return modified config
  return config
})

// ℹ️ Add response interceptor to handle 401 response
axiosIns.interceptors.response.use(response => {
  // Disable global loading
  useLoading().setLoading(false)
  
  return response
}, error => {
  // Disable global loading
  useLoading().setLoading(false)
  
  // Handle error
  if (error?.response?.status === 401) {
    // ℹ️ Logout user and redirect to login page
    // Remove "userData" from localStorage
    localStorage.removeItem('userData')

    // Remove "accessToken" from localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userAbilities')

    // If 401 response returned from api
    // router.push('/login')
    router;
  }
  else {
    return Promise.reject(error)
  }
})
export default axiosIns
