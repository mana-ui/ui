import cx from "classnames";
import { motion ,AnimatePresence} from "framer-motion";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SystemContext from "./SystemContext";

const DialogContext = createContext();

export const Dialog = ({children, content, ...props}) => {
	const [state, setState] = useState(false)
  const [container, setContainer] = useState(null);
	useEffect(() => {
		if (state) {
			const div = document.createElement("div");
			document.body.appendChild(div);
			setContainer(div);
		}
  }, [state]);
	const toggle = useCallback(() => setState(state => !state))
	return <>{children(toggle)}<AnimatePresence onExitComplete={() => {
		document.body.removeChild(container);
		setContainer(null)
	}}>{state && <DialogPortal {...props} container={container}>{content(toggle)}</DialogPortal>}</AnimatePresence></>
}

export const DialogPortal = ({ title, children, className, container }) => {
  const [footer, setFooter] = useState(null);
  const system = useContext(SystemContext);
  const { DialogFooter } = system;
  const classes = system.useDialogStyles();
  
  const variants = {
    enter: { opacity: 1, transition: { duration: 0.15, ease: "linear" } },
    leave: { opacity: 0, transition: { duration: 0.075, ease: "linear" } },
  };
  return (
    container &&
    createPortal(
      <motion.div
        className={classes.scrim}
        variants={variants}
        initial={{ opacity: 0 }}
        animate="enter"
        exit="leave"
      >
        <div className={cx(classes.dialog, className)}>
          <h2 className={classes.title}>{title}</h2>
          <DialogContext.Provider value={footer}>
            <div className={classes.content}>{children}</div>
            <DialogFooter as="footer" ref={setFooter} />
          </DialogContext.Provider>
        </div>
      </motion.div>,
      container
    )
  );
};

export const DialogFooter = ({ children }) => {
  const footer = useContext(DialogContext);
  return footer && createPortal(children, footer);
};
