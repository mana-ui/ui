import { AnimatePresence, motion } from "framer-motion";
import React, {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import SystemContext from "./SystemContext";
import cx from 'classnames'
import {css} from '@emotion/react'

const DialogContext = createContext()

export const Dialog = ({ title, children, className }) => {
  const [container, setContainer] = useState(null);
  const [footer, setFooter] = useState(null)
  const system = useContext(SystemContext);
  const {Actions} = system
  const classes = system.useDialogStyles();
  useEffect(() => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    setContainer(div);
    return () => {
      document.body.removeChild(div);
    };
  }, []);
  const variants = {
      enter: {opacity: 1, transition: {duration: .15, ease: 'linear'}},
      leave: {opacity: 0, transiton: {duration: .075, ease: 'linear'}}
  }
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
          <div className={classes.content}>
            {children}
          </div>
          <Actions as="footer" ref={setFooter} />
          </DialogContext.Provider>
        </div>
      </motion.div>,
      container
    )
  );
};

export const DialogFooter = ({ children }) => {
  const footer = useContext(DialogContext)
  return footer && createPortal(children, footer)
}

const Context = createContext();

export const DialogContainer = ({ children }) => {
  const [content, setContent] = useState(null);
  return (
    <>
      <Context.Provider value={setContent}>{children(setContent)}</Context.Provider>
      <AnimatePresence>
      {content &&
        cloneElement(content, {
          ...content.props,
          close: () => setContent(null),
        })}
        </AnimatePresence>
    </>
  );
};
