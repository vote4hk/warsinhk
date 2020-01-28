export const ROUTE_CHANGE = "route"

export default (state, action) => {
  switch (action.type) {
    case ROUTE_CHANGE:
      return { path: action.path, fullPath: action.fullPath }
    default:
      return { path: "/", fullPath: "/" }
  }
}
