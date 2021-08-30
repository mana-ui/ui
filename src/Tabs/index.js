import styled from "@emotion/styled";
import cx from "classnames";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { createUseStyles, useTheme } from "react-jss";
import SystemContext from "../SystemContext";
import Context from "./Context";
import Tab, { TabContext } from "./Tab";

const { Provider } = Context;

const Indicator = ({ className }) => {
  const theme = useTheme();
  const { useTabStyles } = useContext(SystemContext);
  const classes = useTabStyles({ theme });
  return (
    <motion.div
      layoutId="indicator"
      className={cx(classes.indicator, className)}
      initial={false}
      transition={{ ease: [0.4, 0, 0.2, 1] }}
    />
  );
};

const TabList = ({ className }) => {
  const { useTabListStyles } = useContext(SystemContext);
  const theme = useTheme();
  const classes = useTabListStyles({ theme });
  const { setTabsContainer } = useContext(Context);
  return (
    <div className={cx(classes.tabList, className)} ref={setTabsContainer} />
  );
};

export const Fade = ({ children, activeKey, ...props }) => {
  const initial = (exit = { opacity: 0 });
  const animate = { opacity: 1 };
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={activeKey}
        {...props}
        initial={initial}
        animate={animate}
        exit={exit}
        transition="ease"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const useSlideStyles = createUseStyles({
  slide: {
    "& + &": {
      position: "relative",
      top: "-100%",
    },
  },
});

const Slide = ({ children, activeKey, className, ...props }) => {
  const classes = useSlideStyles();
  return (
    <motion.div
      key={activeKey}
      {...props}
      className={cx(classes.slide, className)}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "ease" }}
    >
      {children}
    </motion.div>
  );
};

const TabPanels = ({
  children,
  className,
  animation = <Slide />,
  ...props
}) => {
  const { useTabPanelsStyles } = useContext(SystemContext);
  const classes = useTabPanelsStyles();
  return (
    <div className={cx(classes.tabPanels, className)} {...props}>
      <AnimateSharedLayout>{children}</AnimateSharedLayout>
    </div>
  );
};

const TabPanel = ({
  children,
  tabKey,
  className,
  title,
  animation = <Slide />,
  ...props
}) => {
  const { useTabPanelStyles, useTabPanelsStyles } = useContext(SystemContext);
  const classes = useTabPanelStyles();
  const panelsClasses = useTabPanelsStyles();
  const { tabsContainer, tab, active } = useContext(Context);
  return (
    <>
      {tabsContainer && (
        <TabContext.Provider value={{ children: title, tabKey }}>
          {createPortal(tab, tabsContainer)}
        </TabContext.Provider>
      )}
      <AnimatePresence initial={false}>
        {tabKey === active &&
          React.cloneElement(
            animation,
            {
              ...animation.props,
              activeKey: active,
              className: panelsClasses.scroll,
            },
            <div {...props} className={cx(classes.tabPanel, className)}>
              {children}
            </div>
          )}
      </AnimatePresence>
    </>
  );
};

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Tabs = ({
  children,
  active,
  setActive,
  tab = <Tab />,
  tabList = <TabList />,
  indicator = <Indicator />,
  ...props
}) => {
  const [tabsContainer, setTabsContainer] = useState();
  return (
    <Provider
      value={{
        active,
        setActive,
        tab,
        tabList,
        tabsContainer,
        indicator,
        setTabsContainer,
      }}
    >
      <TabContainer {...props}>
        {tabList}
        <TabPanels>{children}</TabPanels>
      </TabContainer>
    </Provider>
  );
};

export { Tabs, TabList, TabPanels, TabPanel, Indicator, Tab };
