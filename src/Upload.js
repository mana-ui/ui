import React, { useContext, useRef } from "react";
import { useTheme } from "react-jss";
import SystemContext from "./SystemContext";
import cx from "classnames";

const Upload = ({ onChange, label, className, children, placeholder }) => {
  const ref = useRef();
  const files = ref.current?.files ?? [];
  const active = files.length > 0 ?? false;
  const system = useContext(SystemContext);
  const theme = useTheme();
  const classes = system.useUploadStyles({ active, theme });
  return (
    <div className={cx(classes.wrapper, className)}>
      {label && <label className={classes.label}>{label}</label>}
      {active ? <div className={classes.list}>
        {[].map.call(files, (file) => {
          return <div key={file.name}>{file.name}</div>;
        })}
      </div> :<div className={classes.placeholder}>{ placeholder }</div>}
      {children}
      <input
        ref={ref}
        type="file"
        onChange={( {target: {files}} ) => {
          onChange(files)}}
        className={classes.input}
      />
    </div>
  );
};

export default Upload;
