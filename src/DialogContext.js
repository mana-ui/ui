import { Children, createContext, useContext, useMemo, useState } from "react";
import {AnimatePresence} from 'framer-motion'

const Context = createContext();

export const DialogProvider = ({ children }) => {
  const [modals, setModals] = useState([]);
  const ctxValue = useMemo(() => {
    return [
      (modal) => setModals((modals) => [...modals, modal]),
      () => setModals((modals) => modals.slice(0, -1)),
    ];
  });
  return (
    <Context.Provider value={ctxValue}>
      {children}
      <AnimatePresence>{Children.map(modals, modal => modal)}</AnimatePresence>
    </Context.Provider>
  );
};

export const useDialog = () => {
  return useContext(Context);
};
