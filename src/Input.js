import React, {useContext} from "react";
import { useTheme } from "react-jss";
import SystemContext from "./SystemContext";
import cx from 'classnames'

const Input = ({ value, onChange, type = "text", label, className }) => {
  const val = value ?? ""
  const active = val !== "";
  const {useInputStyles, Label, Input} = useContext(SystemContext);
  const theme = useTheme()
  const classes = useInputStyles({ active, theme });
  return (
    <div className={cx(classes.wrapper, className)}>
      <Input
        type={type}
        value={val}
        onChange={onChange}
        className={classes.input}
      />
      <Label className={classes.label} active={active}>{label}</Label>
    </div>
  );
};

export default Input;
