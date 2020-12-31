import React, {useContext, useRef} from "react";
import { useTheme } from "react-jss";
import SystemContext from "./SystemContext";
import cx from 'classnames'

const Upload = ({ onChange, label, className }) => {
  const ref = useRef()
  const files = ref.current?.files ?? []
  const active = files.length > 0 ?? false;
  const system = useContext(SystemContext);
  const theme = useTheme()
  const classes = system.useUploadStyles({ active, theme });
  return (
    <div className={cx(classes.wrapper, className)} onClick={() => ref.current.click()}>
      <input
        ref={ref}
        type="file"
        onChange={onChange}
        className={classes.input}
      />
      <label className={classes.label}>{label}</label>
      <div className={classes.list}>
        {[].map.call(files, file => {
           return <div>{file.name}</div>
        })}
      </div>
    </div>
  );
};

export default Upload;
