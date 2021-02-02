import cx from "classnames";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, { Children, createContext, useContext, useMemo } from "react";
import { createUseStyles, useTheme } from "react-jss";
import Button from "./Button";
import SystemContext from "./SystemContext";

const Context = createContext();

const { Provider } = Context;

const TabListContext = createContext();

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

const TabList = ({ children, className, indicator }) => {
  const { useTabListStyles } = useContext(SystemContext);
  const theme = useTheme();
  const classes = useTabListStyles({ theme });
  const context = useMemo(() => {
    return {
      indicator: indicator ?? <Indicator />,
    };
  }, [indicator]);
  return (
    <TabListContext.Provider value={context}>
      <div className={cx(classes.tabList, className)}>
        <AnimateSharedLayout>{children}</AnimateSharedLayout>
      </div>
    </TabListContext.Provider>
  );
};

const Tab = ({ children, tabKey, className, ...props }) => {
  const { setActive, active } = useContext(Context);
  const isActive = tabKey === active;
  const { useTabStyles } = useContext(SystemContext);
  const theme = useTheme();
  const classes = useTabStyles({ active: isActive, theme });
  const { indicator } = useContext(TabListContext);
  return (
    <motion.div layout className={classes.tab}>
      <Button
        {...props}
        className={cx(classes.button, className)}
        onClick={() => setActive(tabKey)}
      >
        {children}
      </Button>
      {isActive && indicator}
    </motion.div>
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
    '& + &': {
      position: 'relative',
      top: '-100%',
    }
  }
})

const Slide = ({ children, activeKey, className, ...props }) => {
  const classes = useSlideStyles()
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={activeKey}
        {...props}
        className={cx(classes.slide, className)}
        initial={{ x: "100%"}}
        animate={{x: 0}}
        exit={{ x: "-100%" }}
        transition={{ type: "ease"}}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const TabPanels = ({
  children,
  className,
  animation = <Slide />,
  ...props
}) => {
  const { active } = useContext(Context);
  const { useTabPanelsStyles } = useContext(SystemContext);
  const classes = useTabPanelsStyles();
  children = Children.toArray(children);
  children = children.find(({ props: { tabKey } }) => tabKey === active);
  return (
    <div className={cx(classes.tabPanels, className)} {...props}>
      {React.cloneElement(
        animation,
        { ...animation.props, activeKey: active, className: classes.scroll },
        children
      )}
    </div>
  );
};

const TabPanel = ({ children, tabKey, className, ...props }) => {
  const { useTabPanelStyles } = useContext(SystemContext);
  const classes = useTabPanelStyles();
  return (
    <div {...props} className={cx(classes.tabPanel, className)}>
      {children}
    </div>
  );
};

const Tabs = ({ children, active, setActive, ...props }) => {
  return (
    <Provider value={{ active, setActive }}>
      <div {...props}>{children}</div>
    </Provider>
  );
};

export { Tabs, TabList, TabPanels, Tab, TabPanel, Indicator };
