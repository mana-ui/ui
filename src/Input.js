import React, {useContext} from "react";
import SystemContext from "./SystemContext";

const Input = ({ value, onChange, type = "text", label }) => {
  const active = !!(value ?? "" !== value);
  const system = useContext(SystemContext);
  const classes = system.useInputStyles({ active });
  return (
    <div className={classes.wrapper}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={classes.input}
      />
      <label className={classes.label}>{label}</label>
    </div>
  );
};

export default Input;
