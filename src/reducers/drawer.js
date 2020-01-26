export const DRAWER_OPEN = 'drawer_open'
export const DRAWER_CLOSE = 'drawer_close'

export default (state, action) => {
  switch (action.type) {
    case DRAWER_OPEN:
      return { open: true }
    default:
      return { open: false }
  }
}
