import React, { useContext } from 'react'
import SystemContext from './SystemContext'

const Actions = ({children}) => {
    const system = useContext(SystemContext)
    const classes = system.useActionsStyles()
  return (
      <div className={classes.actions}>{children}</div>
  )
}

export default Actions