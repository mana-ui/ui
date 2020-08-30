import React from 'react'
import SystemContext from './SystemContext'

const SystemProvider = ({system, children}) => <SystemContext.Provider value={system}>{children}</SystemContext.Provider>

export default SystemProvider