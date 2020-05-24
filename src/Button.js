import React from "react";
import { useRipple } from "@mana/lib";
import { css } from 'linaria'

const Button = ({ children, ...props }) => {
  const [surface, ripple] = useRipple();
  return (
    <button
      {...props}
      ref={surface}
      className={css` position: relative; overflow: hidden; cursor: pointer;`}
    >
      {children}
      {ripple}
    </button>
  );
};

export default Button;
