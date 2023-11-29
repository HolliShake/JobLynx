
export const SUBJECT = Object.freeze([
    "admin",
    "user",
])

export const ACTIONS = Object.freeze(
    [
        "all",
        "read",
        "write",
        "update",
        "delete",
    ]
)

export function make(arrayOfPath) {
    const newPath = []

    for (let s = 0; s < SUBJECT.length; s++) {

        const subject = SUBJECT[s]

        for (let i = 0; i < arrayOfPath.length; i ++) {
            newPath.push({
                ...arrayOfPath[i],
                subject: subject,
                action: "read"
            })
        }
    }

    return newPath;
}

