

const EMPLOYEMENT_TYPE_ITEMS = [
    {
        title: "Full Time",
        value: "Full-Time"
    },
    {
        title: "Part Time",
        value: "Part-Time"
    },
    {
        title: "Job Order",
        value: "Job Order"
    },
    {
        title: "Contractual",
        value: "Contractual"
    },
    {
        title: "Casual",
        value: "Casual"
    },
]

function mapEmploymentType(value) {
    return EMPLOYEMENT_TYPE_ITEMS.find(item => item.value == value)?.title ?? "[INVALID]"
}

export {
    EMPLOYEMENT_TYPE_ITEMS,
    mapEmploymentType,
}
