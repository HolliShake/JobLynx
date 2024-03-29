

// const COMPANY_PATTERN = new RegExp('/company/.*/.*')


// export const SUBJECT = Object.freeze([
//     "admin",
//     "user",
// ])

// export const ACTIONS = Object.freeze(
//     [
//         "all",
//         "read",
//         "write",
//         "update",
//         "delete",
//     ]
// )

// export function make(arrayOfPath) {
//     const newPath = []

//     for (let s = 0; s < SUBJECT.length; s++) {

//         const subject = SUBJECT[s]

//         for (let i = 0; i < arrayOfPath.length; i ++) {

//             if (arrayOfPath[i].type === "divider") {
//                 newPath.push(arrayOfPath[i])
                
//             } else {
//                 newPath.push({
//                     ...arrayOfPath[i],
//                     hidden: () => (!COMPANY_PATTERN.test(window.location.pathname)),
//                     subject: subject,
//                     action: "read"
//                 })
//             }
//         }
//     }

//     return newPath;
// }

export function make(role, arrayOfPath) {
  return arrayOfPath.map(ap => ({
    ...ap,
    subject: role,
    action: 'read',
  }))
}
