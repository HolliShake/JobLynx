
const PAYMENT_TYPE_ITEMS = [
    {
        title: "Hourly",
        value: "Hourly"
    },
    {
        title: "Daily",
        value: "Daily"
    },
    {
        title: "Monthly",
        value: "Monthly"
    },
    {
        title: "Anually",
        value: "Anually"
    },
]

function mapPaymentType(value) {
    return PAYMENT_TYPE_ITEMS.find(item => item.value == value)?.title ?? "[INVALID]"
}

export {
    PAYMENT_TYPE_ITEMS,
    mapPaymentType,
}
