import React, { createContext, forwardRef, useContext, useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "react-jss";
import SystemContext from "./SystemContext";

const Context = createContext();

const Container = forwardRef(({ options, value, label, classes, setFocus }, ref) => {
  return (
    <>
      <div ref={ref} tabIndex={0} className={classes.selected}>
        {options.find((option) => option.value === value)?.children}
      </div>
      <label className={classes.label}>{label}</label>
    </>
  );
});

const ListItem = ({ children, active, onClick }) => {
  const system = useContext(SystemContext);
  const theme = useTheme();
  const classes = system.useListItemStyles({ active, theme });
  return (
    <div className={classes.listItem} onClick={onClick}>
      {children}
    </div>
  );
};

const DropDown = forwardRef(({ classes, options, activeValue, onChange }, ref) => {
  return (
    <div className={classes.dropdown} ref={ref}>
      {options.map(({ children, value }) => (
        <ListItem
          key={value}
          active={activeValue === value}
          onClick={() => {
            onChange(value);
          }}
        >
          {children}
        </ListItem>
      ))}
    </div>
  );
});

export const Select = ({ children, value, onChange, ...props }) => {
  const options = [];
  const [show, setShow] = useState(false);
  const selectedRef = useRef()
  const dropdownRef = useRef()
  const system = useContext(SystemContext);
  const theme = useTheme();
  const classes = system.useSelectStyles({
    theme,
    active: value !== null && value !== void 0,
    focus: show,
  });
  useLayoutEffect(() => {
    if (show) {
        const handler = (evt) => {
            if (!dropdownRef.current.contains(evt.target)) {
                setShow(false)
            }
        }
        document.addEventListener('click', handler)
        return () => {
            document.removeEventListener('click', handler)
        }
    }
  }, [show])
  return (
    <Context.Provider
      value={(option) => {
        options.push(option);
      }}
    >
      {children}
      <div
        className={classes.wrapper}
        onClick={() => {
          if (show === false) setShow(true);
        }}
      >
        <Container
            ref={selectedRef}
          value={value}
          options={options}
          classes={classes}
          show={show}
          {...props}
        />
        {show && (
          <DropDown
            ref={dropdownRef}
            options={options}
            classes={classes}
            activeValue={value}
            onChange={(v) => {
                selectedRef.current.focus()
              onChange(v);
              setShow(false);
            }}
          />
        )}
      </div>
    </Context.Provider>
  );
};

export const Option = (props) => {
  const setOption = useContext(Context);
  setOption(props);
  return null;
};
