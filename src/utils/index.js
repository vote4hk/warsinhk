export const isSSR = () => typeof window === "undefined"

export const saveToLocalStorage = (key, value) => {
  if (typeof Storage !== "undefined") {
    window.localStorage.setItem(key, value)
  }
}

export const loadFromLocalStorage = key => {
  if (typeof Storage !== "undefined") {
    return window.localStorage.getItem(key)
  }
  return null
}

export const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b)
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
}

export const formatNumber = num =>
  num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

export const formatDateDDMM = d => {
  // Orignal formatString: "DD/M" cannot be parsed in DatePicker
  // formatString: "YYYY-MM-DD" for DatePicker
  // Reformat for UI here
  if (d) {
    d = d.replace(/(\d{4})-(\d\d)-(\d\d)/, function(_, y, m, d) {
      return [d, m].join("/")
    })
  }
  return d
}
