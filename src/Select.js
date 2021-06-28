import React, {
  createContext,
  forwardRef,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme } from "react-jss";
import SystemContext from "./SystemContext";
import cx from "classnames";
import { usePopper } from "react-popper";
import { AnimatePresence, motion } from "framer-motion";

const Context = createContext();

const Container = forwardRef(function SelectContainer(
  { options, value, label, classes, suffix },
  ref
) {
  return (
    <>
      <div ref={ref} tabIndex={0} className={classes.selected}>
        {options.find((option) => option.value === value)?.children}
      </div>
      <label className={classes.label}>{label}</label>
      <span className={classes.suffix}>{suffix}</span>
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

const variants = {
  enterFade: {
    opacity: 1,
    transition: {
      duration: 0.267,
    },
  },
  enterScale: { scaleX: 1, scaleY: 1, transition: { duration: 0.178 } },
  leaveFade: {
    opacity: 0,
    transition: {
      duration: 0.267,
    },
  },
  leaveScale: {
    scaleX: 0.75,
    scaleY: 0.5625,
    transition: { duration: 0.178, delay: 0.089 },
  },
};
const DropDown = forwardRef(function DropDown(
  { classes, options, activeValue, onChange, style },
  ref
) {
  return (
    <div style={style} className={classes.popRef} ref={ref}>
      <motion.div
        className={classes.dropdown}
        transition={{ ease: [0.4, 0, 0.2, 1] }}
        variants={variants}
        initial={{ opacity: 0, scaleX: 0.75, scaleY: 0.5625 }}
        animate={["enterFade", "enterScale"]}
        exit={["leaveFade", "leaveScale"]}
      >
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
      </motion.div>
    </div>
  );
});

const sameWidth = {
  name: "sameWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`;
  },
  effect: ({ state }) => {
    state.elements.popper.style.width = `${
      state.elements.reference.offsetWidth
    }px`;
  }
};

export const Select = ({ className, children, value, onChange, ...props }) => {
  const options = [];
  const [show, setShow] = useState(false);
  const selectedRef = useRef();
  const wrapperRef = useRef();
  const system = useContext(SystemContext);
  const theme = useTheme();
  const classes = system.useSelectStyles({
    theme,
    active: value !== null && value !== void 0,
    focus: show,
  });
  useLayoutEffect(() => {
    if (show) {
      const handler = ({ target }) => {
        if (!wrapperRef.current.contains(target)) setShow(false);
      };
      document.addEventListener("click", handler);
      return () => {
        document.removeEventListener("click", handler);
      };
    }
  }, [show]);

  const [popperElement, setPopperElement] = useState(null);
  const offsetModifer = useMemo(
    () => ({
      name: "offset",
      options: {
        offset: ({ placement, reference, popper }) => {
          return [0, -reference.height / 2];
        },
      },
    }),
    []
  );
  const { styles } = usePopper(wrapperRef.current, popperElement, {
		strategy: 'fixed',
    modifiers: [offsetModifer, sameWidth],
  });
  return (
    <Context.Provider
      value={(option) => {
        options.push(option);
      }}
    >
      {children}
      <div
        ref={wrapperRef}
        className={cx(classes.wrapper, className)}
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
        <AnimatePresence>
          {show && (
            <DropDown
              ref={setPopperElement}
              style={styles.popper}
              options={options}
              classes={classes}
              activeValue={value}
              onChange={(v) => {
                selectedRef.current.focus();
                if (onChange) onChange(v);
                setShow(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </Context.Provider>
  );
};

export const Option = (props) => {
  const setOption = useContext(Context);
  setOption(props);
  return null;
};
