import React from "react"
import drawerReducer from "@/reducers/drawer"
import routeReducer from "@/reducers/route"

export const drawerInitialState = {
  open: false,
}

export const routeInitialState = {
  path: "/",
  fullPath: "/",
}

const ContextStore = React.createContext({
  drawer: drawerInitialState,
  route: routeInitialState,
})

export const ContextStoreProvider = props => {
  const [drawerState, drawerDispatch] = React.useReducer(
    drawerReducer,
    drawerInitialState
  )

  const [routeState, routeDispatch] = React.useReducer(
    routeReducer,
    routeInitialState
  )

  return (
    <ContextStore.Provider
      value={{
        drawer: {
          state: drawerState,
          dispatch: drawerDispatch,
        },
        route: {
          state: routeState,
          dispatch: routeDispatch,
        },
      }}
      {...props}
    />
  )
}

export default ContextStore
