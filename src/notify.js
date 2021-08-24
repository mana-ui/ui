import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { AnimatePresence, motion } from "framer-motion";

const ref = {};

const Notification = ({ children }) => {
  const variants = {
    enter: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.15, ease: "linear" },
    },
    leave: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.075, ease: "linear" },
    },
  };
  return (
    <div
      css={css`
        position: fixed;
        top: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
				z-index: 8;
      `}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        variants={variants}
        animate="enter"
        exit="leave"
        css={css`
					border-radius: 4px;
          box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014,
            0 9px 28px 8px #0000000d;
        `}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const NotificationContainer = ({ children }) => {
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    ref.notify = setNotification;
  }, []);
  useEffect(() => {
    if (notification)
      setTimeout(() => {
        setNotification(null);
      }, notification.timeout);
  }, [notification]);
  return (
    <>
      {children}
      <AnimatePresence>
        {notification ? (
          <Notification>{notification.content}</Notification>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default (content, timeout = 2000) => {
  ref.notify?.({ content, timeout });
};
