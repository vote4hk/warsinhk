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