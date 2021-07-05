import React, {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
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
import maxSize from "popper-max-size-modifier";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const Context = createContext();

const Input = styled.input({
	border: 0,
	padding: 0,
	height: '100%',
	fontSize: '1rem',
	outline: 0,
	background: 'transparent',
}, props => ({caretColor: props.theme.color.primary}))

const Selected = styled.div({
  boxSizing: 'border-box',
  cursor: 'pointer',
  width: "100%",
  height: "100%",
  fontSize: '1rem',
  fontWeight: 400,
  letterSpacing: '.009375em',
  alignSelf: 'flex-end',
  border: 0,
  borderBottom: `1px solid #ced4da`,
  padding: '20px 16px 6px',
  outline: 0,
  "&:-webkit-autofill:first-line": {
    fontSize: 16,
    fontFamily: "Sans-Serif",
  },
  animationDelay: "1s" /* Safari support - any positive time runs instantly */,
  animationName: "$autofill",
  animationFillMode: "both",
  "&:-internal-autofill-selected + label": {
    transform: "translateY(-106%) scale(0.75)",
  },
}, ({theme: {color: {primary}}}) => ({"&:focus, &:focus-within": {
  borderBottom: `1px solid ${primary}`,
  "& + label": {
    color: primary,
    transform: "translateY(-106%) scale(0.75)",
  },
}}))

const Container = forwardRef(function SelectContainer(
  { options, value, label, classes, suffix, show, search, kw, setKw },
  ref
) {
  const selectedRef = useRef();
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      (inputRef.current ?? selectedRef.current).focus();
    },
  }));
  return (
    <>
      <Selected ref={selectedRef} tabIndex={0}>
        {show && search ? (
          <Input
            ref={inputRef}
            value={kw}
            onChange={({ target: { value } }) => setKw(value)}
          />
        ) : (
          options.find((option) => option.value === value)?.children
        )}
      </Selected>
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
  { classes, options, activeValue, onChange, style, kw },
  ref
) {
  return (
    <div
      style={style}
      className={classes.popRef}
      css={css`
        display: flex;
        align-items: stretch;
      `}
      ref={ref}
    >
      <motion.div
        css={css`
          flex: 1;
          overflow: auto;
        `}
        className={classes.dropdown}
        transition={{ ease: [0.4, 0, 0.2, 1] }}
        variants={variants}
        initial={{ opacity: 0, scaleX: 0.75, scaleY: 0.5625 }}
        animate={["enterFade", "enterScale"]}
        exit={["leaveFade", "leaveScale"]}
      >
        {options
          .filter(({ children }) =>
            children.toLowerCase().includes(kw.toLowerCase())
          )
          .map(({ children, value }) => (
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
    state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
  },
};

const applyMaxSize = {
  name: "applyMaxSize",
  enabled: true,
  phase: "beforeWrite",
  requires: ["maxSize"],
  fn({ state }) {
    const { height } = state.modifiersData.maxSize;
    state.styles.popper = {
      ...state.styles.popper,
      maxHeight: `${height - 48}px`,
    };
  },
};

const preventOverflow = {
  name: 'preventOverflow',
  requires: ['offset'],
  options: {
    mainAxis: false,
    altAxis: true,
    padding: 48,
  }
}

export const Select = ({
  className,
  style,
  children,
  value,
  onChange,
  search,
  ...props
}) => {
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
      if (search) {
        selectedRef.current.focus();
      }
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
  
  const { styles } = usePopper(wrapperRef.current, popperElement, {
    strategy: "fixed",
    modifiers: [sameWidth, ...search ? [  maxSize, applyMaxSize]: [preventOverflow]],
  });
  const [kw, setKw] = useState("");
  return (
    <Context.Provider
      value={(option) => {
        options.push(option);
      }}
    >
      {children}
      <div
        style={style}
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
          search={search}
          kw={kw}
          setKw={setKw}
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
              kw={kw}
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
