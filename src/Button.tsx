import React, { useContext } from "react";
import { useRipple } from "@mana-ui/lib";
import SystemContext from "./SystemContext";
import {useTheme} from 'react-jss'

const Button = ({ children, className, ...props }) => {
  const theme = useTheme() as any
  const [surface, ripple] = useRipple(theme.color.primary);
  const {Button: Btn} = useContext(SystemContext)
  return (
    <Btn
      {...props}
      ref={surface}
      className={className}
    >
      {children}
      {ripple}
    </Btn>
  );
};

export default Button;
