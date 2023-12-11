import Hashids from 'hashids'

const SALT = "S@lt"
const KEY = "Dt0!"

const security = ({
  encrypt: function (text) { 
    try {
      return (new Hashids('dto@cqi', 8)).encode(text)
    } catch (err) {
      return "0"
    }
  },
  decrypt: function (text) { 
    text = text.toString()
    try {  
      return (new Hashids('dto@cqi', 8)).decode(text).pop()
    } catch (err) {
      return "0"
    }
  },
})

const formater = ({
  dateToWord: function(dateString) {
    const date = new Date(dateString)
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    let dd = date.getDate()

    if (dd < 10)
    {
      dd = `0${dd}`
    }

    return `${MONTHS[date.getMonth()]} ${dd}, ${date.getFullYear()}`
  },
  toPhpDate: (dateString) => {
    return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ')
  },
  numberToMoney: (number) => {
    return parseFloat(number).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }
})

const resolver = ({
  getImagePath: (filePath) => {
    return `${import.meta.env.VITE_APP_UPLOADS_FOLDER}/${filePath}`
  },
  naiveSearch: (requiredSkills, currentSkill) => {
    let M = currentSkill.length;
    let N = requiredSkills.length;
  
    /* A loop to slide pat one by one */
    for (let i = 0; i <= N - M; i++) 
    {
      let j;

      /* For current index i, check for pattern 
      match */
      for (j = 0; j < M; j++) {
        if (requiredSkills[i + j] != currentSkill[j]) {
          break
        }
      }

      // if pat[0...M-1] = txt[i, i+1, ...i+M-1]
      if (j == M) {
        return true;
      }
    }

    return false;
  },
  getQualification: (skillsArray, requiredSkillsText) => {
    let match = 0;
    let skillCount = requiredSkillsText.split(" ").length;

    for (let i=0; i < skillsArray.length; i++) {
      if (resolver.naiveSearch(requiredSkillsText, skillsArray[i])) {
        match++;
      }
    }

    if (match >= skillCount) {
      return 100;
    }

    return parseInt(Math.round((match / skillCount) * 100));
  },
  resolveColor: (progress) => {
    if (progress >= 0 && progress <= 20) return "error"
    else if (progress >= 21 && progress <= 40) return "warning"
    else if (progress >= 41 && progress <= 60) return "info"
    else if (progress >= 61 && progress <= 80) return "primary"
    else if (progress >= 81 && progress <= 100) return "success"
    return "black"
  }
})

export const helpers = Object.freeze({
  security,
  formater,
  resolver,
})

