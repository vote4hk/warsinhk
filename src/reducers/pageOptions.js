import { saveToLocalStorage } from "@/utils"

export const ALERT_CLOSE = "alert_close"
export const FONT_ZOOMIN = "font_zoomin"
export const FONT_ZOOMOUT = "font_zoomout"
export const FONT_ZOOM_LOCALSTORAGE_KEY = "font_zoom"
export const FONT_ZOOM_MIN = 0.5

export default (state, action) => {
  switch (action.type) {
    case ALERT_CLOSE:
      return {
        ...state,
        closedAlerts: [...state.closedAlerts, action.alert_id],
      }
    case FONT_ZOOMIN: {
      saveToLocalStorage(FONT_ZOOM_LOCALSTORAGE_KEY, state.fontZoom + 0.5)
      return { ...state, fontZoom: state.fontZoom + 0.5 }
    }
    case FONT_ZOOMOUT: {
      const fontZoom = state.fontZoom - 0.5
      if (fontZoom < FONT_ZOOM_MIN) {
        return { ...state }
      }
      saveToLocalStorage(FONT_ZOOM_LOCALSTORAGE_KEY, fontZoom)
      return { ...state, fontZoom }
    }
    default:
      return { ...state }
  }
}
