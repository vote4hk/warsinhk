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

export const formatDateMDD = d => {
  // Orignal formatString: "DD/M" cannot be parsed in DatePicker
  // formatString: "YYYY-MM-DD" for DatePicker
  // Reformat for UI here
  if (d) {
    d = d.replace(/(\d{4})-(\d\d)-(\d\d)/, function(_, y, m, d) {
      return [+m, d].join(".")
    })
  }
  return d
}


export const getDistanceFromLatLonInKm =
  (lat1,lon1,lat2,lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);  // deg2rad below
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

const deg2rad = (deg) => deg * (Math.PI/180);