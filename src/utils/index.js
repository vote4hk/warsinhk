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
