const setItem =(key,value)=>window.localStorage.setItem(key,typeof value ==='object'?JSON.stringify(value):value)
const getItem =(key)=>localStorage.getItem(key)