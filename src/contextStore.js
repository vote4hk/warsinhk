import React from 'react'
import drawerReducer from '@/reducers/drawer'

export const drawerInitialState = {
  open: false,
}

const ContextStore = React.createContext({
  drawer: drawerInitialState,
})

export const ContextStoreProvider = props => {
  const [drawerState, drawerDispatch] = React.useReducer(
    drawerReducer,
    drawerInitialState
  )

  return (
    <ContextStore.Provider
      value={{
        drawer: {
          state: drawerState,
          dispatch: drawerDispatch,
        },
      }}
      {...props}
    />
  )
}

export default ContextStore
