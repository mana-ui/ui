import React, {useContext} from "react";
import { useTheme } from "react-jss";
import SystemContext from "./SystemContext";
import cx from 'classnames'

const Textarea = ({ value, onChange, type = "text", label, className, rows }) => {
  const val = value ?? ""
  const active = val !== "";
  const system = useContext(SystemContext);
  const theme = useTheme()
  const classes = system.useTextareaStyles({ active, theme });
  return (
    <div className={cx(classes.wrapper, className)}>
      <textarea
        rows={rows}
        type={type}
        value={val}
        onChange={onChange}
        className={classes.textarea}
      />
      <label className={classes.label}>{label}</label>
    </div>
  );
};

export default Textarea;
