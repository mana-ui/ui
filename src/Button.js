import React, { useContext } from "react";
import { useRipple } from "@mana/lib";
import SystemContext from "./SystemContext";

const Button = ({ children, ...props }) => {
  const [surface, ripple] = useRipple();
  const system = useContext(SystemContext)
  const classes = system.useButtonStyles()
  return (
    <button
      {...props}
      ref={surface}
      className={classes.button}
    >
      {children}
      {ripple}
    </button>
  );
};

export default Button;
