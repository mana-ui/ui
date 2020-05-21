import React from "react";
import { useRipple } from "@mana/lib";

const Button = ({ children, ...props }) => {
  const [surface, ripple] = useRipple();
  return (
    <button
      {...props}
      ref={surface}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {children}
      {ripple}
    </button>
  );
};

export default Button;
