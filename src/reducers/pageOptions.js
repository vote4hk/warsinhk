export const ALERT_CLOSE = "alert_close"
export const FONT_ZOOMIN = "font_zoomin"
export const FONT_ZOOMOUT = "font_zoomout"

export default (state, action) => {
  switch (action.type) {
    case ALERT_CLOSE:
      return {
        ...state,
        closedAlerts: [...state.closedAlerts, action.alert_id],
      }
    case FONT_ZOOMIN:
      return { ...state, fontZoom: state.fontZoom + 0.5 }
    case FONT_ZOOMOUT:
      return { ...state, fontZoom: state.fontZoom - 0.5 }
    default:
      return { ...state }
  }
}
