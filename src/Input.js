import React, {useContext} from "react";
import { useTheme } from "react-jss";
import SystemContext from "./SystemContext";
import cx from 'classnames'

const Input = ({ value, onChange, type = "text", label, className }) => {
  const val = value ?? ""
  const active = val !== "";
  const system = useContext(SystemContext);
  const theme = useTheme()
  const classes = system.useInputStyles({ active, theme });
  return (
    <div className={cx(classes.wrapper, className)}>
      <input
        type={type}
        value={val}
        onChange={onChange}
        className={classes.input}
      />
      <label className={classes.label}>{label}</label>
    </div>
  );
};

export default Input;
