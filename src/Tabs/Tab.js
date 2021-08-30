import React, { createContext, useContext } from "react";
import Context from './Context'
import SystemContext from '../SystemContext'
import { useTheme } from "react-jss";
import TabListContext from "./TabListContext";
import { motion } from "framer-motion";

export const TabContext = createContext()

const InnerTab = ({ children, tabKey, className, ...props }) => {
  const { setActive, active, indicator } = useContext(Context);
  const isActive = tabKey === active;
  const { useTabStyles, TabButton } = useContext(SystemContext);
  const theme = useTheme();
  const classes = useTabStyles({ active: isActive, theme });
  return (
    <motion.div layout className={classes.tab}>
      <TabButton
        {...props}
        className={className}
        onClick={() => setActive(tabKey)}
      >
        {children}
      </TabButton>
      {isActive && indicator}
    </motion.div>
  );
};

const Tab = (props) => {
	const {children, tabKey} = useContext(TabContext)
	return <InnerTab {...props} tabKey={tabKey}>{children}</InnerTab>
}

export default Tab