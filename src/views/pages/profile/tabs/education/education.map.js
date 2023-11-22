

const EDUCATION_ITEMS = Object.freeze([
    {
        title: "GRADUATED",
        value: "graduated"
    },
    {
        title: "NOT GRADUATED",
        value: "notgraduated"
    },
    {
        title: "ACTIVE",
        value: "active"
    }
])

const mapValue = (value) => {
    const item = EDUCATION_ITEMS.find(item => item.value === value);
    return item ? item.title : "";
}

export {
    EDUCATION_ITEMS,
    mapValue
}
