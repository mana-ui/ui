import React, { Children, createContext, useContext } from "react";
import { useTheme } from "react-jss";
import Button from "./Button";
import SystemContext from "./SystemContext";
import { AnimateSharedLayout, motion } from "framer-motion";
import cx from 'classnames'

const Context = createContext();

const { Provider } = Context;

const TabList = ({ children, className }) => {
  const { useTabListStyles } = useContext(SystemContext);
  const theme = useTheme();
  const classes = useTabListStyles({ theme });
  return (
    <AnimateSharedLayout>
      <div className={cx( classes.tabList, className )}>{children}</div>
    </AnimateSharedLayout>
  );
};

const Tab = ({ children, tabKey, className, ...props }) => {
  const { setActive, active } = useContext(Context);
  const isActive = tabKey === active;
  const { useTabStyles } = useContext(SystemContext);
  const theme = useTheme();
  const classes = useTabStyles({ active: isActive, theme });
  return (
    <div className={classes.tab}>
      <Button
        {...props}
        className={cx(classes.button, className)}
        onClick={() => setActive(tabKey)}
      >
        {children}
      </Button>
      {isActive && (
        <motion.div
          layoutId="indicator"
          className={classes.indicator}
          initial={false}
          transition={{ ease: [0.4, 0, 0.2, 1] }}
        />
      )}
    </div>
  );
};

const TabPanels = ({ children, ...props }) => {
  const { active } = useContext(Context);
  const { useTabPanelsStyles } = useContext(SystemContext);
  const classes = useTabPanelsStyles();
  children = Children.toArray(children)
  const activeIndex = children.findIndex(({props: {tabKey}}) => tabKey === active)
  const x = activeIndex * 100 / children.length 
  return (
    <div className={classes.tabPanels} {...props}>
      <motion.div className={classes.scroll} style={{width: `${children.length*100}%`}} initial={{x: 0}} animate={ {x: `-${x}%`} } transition="ease" >
      {children}
      </motion.div>
    </div>
  );
};

const TabPanel = ({ children, tabKey, ...props }) => {
  const { useTabPanelStyles } = useContext(SystemContext);
  const classes = useTabPanelStyles();
  return (
    <div
      {...props}
      className={classes.tabPanel}
    >
      {children}
    </div>
  );
};

const Tabs = ({ children, active, setActive, ...props }) => {
  return <Provider value={{ active, setActive }}><div {...props}>{children}</div></Provider>;
};

export { Tabs, TabList, TabPanels, Tab, TabPanel };
