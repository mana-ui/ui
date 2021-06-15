import React, { useContext } from "react";
import { useRipple } from "@mana-ui/lib";
import SystemContext from "./SystemContext";
import { useTheme } from "@emotion/react";

const render = (Component, {children, ...props}, rippleColor) => {
  const theme = useTheme();
  const [surface, ripple] = useRipple(rippleColor ?? theme.color.primary);
  return (
    <Component {...props} ref={surface}>
      {children}
      {ripple}
    </Component>
  );
};

const Button = (props) => {
  const { Button } = useContext(SystemContext);
  return render(Button, props, '#fff');
};

const Text = (props) => {
  const { Text } = useContext(SystemContext);
  return render(Text, props);
};

const Outlined = (props) => {
  const { Outlined } = useContext(SystemContext);
  return render(Outlined, props);
};

Button.Text = Text;
Button.Outlined = Outlined

export default Button;
