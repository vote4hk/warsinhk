export const ALERT_CLOSE = "alert_close"

export default (state, action) => {
  switch (action.type) {
    case ALERT_CLOSE:
      return { closedAlerts: [...state.closedAlerts, action.alert_id] }
    default:
      return { closedAlerts: [] }
  }
}
