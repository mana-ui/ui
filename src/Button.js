import React, { useContext } from "react";
import { useRipple } from "@mana/lib";
import SystemContext from "./SystemContext";
import cx from "classnames";
import {useTheme} from 'react-jss'

const Button = ({ children, className, ...props }) => {
  const theme = useTheme()
  const [surface, ripple] = useRipple(theme.color.primary);
  const system = useContext(SystemContext)
  const classes = system.useButtonStyles()
  return (
    <button
      {...props}
      ref={surface}
      className={cx( classes.button, className )}
    >
      {children}
      {ripple}
    </button>
  );
};

export default Button;
