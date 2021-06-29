import { Children, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {AnimatePresence} from 'framer-motion'

const Context = createContext();

export const DialogProvider = ({ children }) => {
	const idRef = useRef(0)
  const [dialogs, setDialogs] = useState({});
	const ctxValue = useMemo(() => ([
		(dialog, id) => {
			id = id ?? idRef.current++
			setDialogs(dialogs => ({...dialogs, [id]: dialog}))
			return id
		},
		(id) => {
			setDialogs(dialogs => {
				delete dialogs[id]
				return {...dialogs}
			})
		}
	]), [])
  return (
    <Context.Provider value={ctxValue}>
      {children}
      <AnimatePresence>{Children.map(Object.values(dialogs), dialog => dialog)}</AnimatePresence>
    </Context.Provider>
  );
};

export const useDialog = (dialog) => {
	const [isVisible, setVisible] = useState()
	const idRef = useRef()
	const [open, close ] = useContext(Context)
	const closeDialog = useCallback(() => {
		setVisible(false)
		close(idRef.current)
	}, [])
	useEffect(() => {
		if (isVisible) {
			idRef.current = open(dialog(closeDialog), idRef.current)
		}
	})
	return useMemo(() => [() => setVisible(true), closeDialog], [])
};
