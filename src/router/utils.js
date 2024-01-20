/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => !!(localStorage.getItem('userData') && localStorage.getItem('accessToken'))


/**
 * Returns true if user is admin or has the permission
 * @param {string} subject
 * @param {string} action
 * @returns {boolean} 
 */
export const userCan = (subject, action) => {
  if (!(subject || action)) {
    return false
  }
  
  try {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const userAbility = JSON.parse(localStorage.getItem('userAbilities'))
  
    if (userData?.constructor.name != 'Object') {
      return false
    }
  
    if (userAbility?.constructor.name != 'Array') { 
      return false
    }
  
    if (userData.role?.toLowerCase() == 'admin') {
      return true
    }
  
    if (userAbility.length <= 0) {
      return false
    }
  
    if (userAbility.map(a => a.subject).includes(subject)) {
      return !!(userAbility.map(a => a.action).find(a => a == action))
    } else {
      return false
    }
  
  } catch (error) {
    console.log(error)
      
    return false
  }
}
