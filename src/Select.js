import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
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

const Input = styled.input(
  {
    border: 0,
    padding: 0,
    height: "100%",
    fontSize: "1rem",
    outline: 0,
    background: "transparent",
  },
  (props) => ({ caretColor: props.theme.color.primary })
);

const Selected = styled.div(
  {
    boxSizing: "border-box",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    fontSize: "1rem",
    fontWeight: 400,
    letterSpacing: ".009375em",
    alignSelf: "flex-end",
    border: 0,
    borderBottom: `1px solid #ced4da`,
    padding: "20px 16px 6px",
    outline: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "&:-webkit-autofill:first-line": {
      fontSize: 16,
      fontFamily: "Sans-Serif",
    },
    animationDelay:
      "1s" /* Safari support - any positive time runs instantly */,
    animationName: "$autofill",
    animationFillMode: "both",
    "&:-internal-autofill-selected + label": {
      transform: "translateY(-106%) scale(0.75)",
    },
  },
  ({
    show,
    theme: {
      color: { primary },
    },
  }) => {
    const style = {
      borderBottom: `1px solid ${primary}`,
      "& + label": {
        color: primary,
      },
    };
    return Object.assign(
      {
        "&:focus, &:focus-within": style,
      },
      show
        ? {
            borderBottom: `1px solid ${primary}`,
            "& + label": {
              color: primary,
              transform: "translateY(-106%) scale(0.75)",
            },
          }
        : null
    );
  }
);

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
      <Selected ref={selectedRef} tabIndex={0} show={show == SHOW}>
        {show === SHOW && search ? (
          <Input
            ref={inputRef}
            value={kw}
            onChange={({ target: { value } }) => setKw(value)}
          />
        ) : (
          options.find((option) => option.props.value === value)?.props.children
        )}
      </Selected>
      <label className={classes.label}>{label}</label>
      <span className={classes.suffix}>{suffix}</span>
    </>
  );
});

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

const PopRef = styled.div`
  z-index: 8;
  display: flex;
  align-items: stretch;
`;

const DropDown = forwardRef(function DropDown(
  { classes, options, style },
  ref
) {
  return (
    <PopRef style={style} ref={ref}>
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
        {options}
      </motion.div>
    </PopRef>
  );
});

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
  name: "preventOverflow",
  options: {
    mainAxis: false,
    altAxis: true,
    padding: 48,
    tether: false
  },
};

const minWidth = {
  name: "minWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],
  fn: ({ state }) => {
    state.styles.popper.minWidth = `${state.rects.reference.width}px`;
  },
  effect: ({ state }) => {
    state.elements.popper.style.minWidth = `${
      state.elements.reference.offsetWidth
    }px`;
  }
};

const SHOW = 0
const CANCEL_HIDE = 1
const SELECT_HIDE = 2

export const Select = ({
  className,
  style,
  children,
  value,
  onChange,
  search,
  options,
  ...props
}) => {
  const [dropdown, setDropdown] = useState(CANCEL_HIDE);
  const selectedRef = useRef();
  const wrapperRef = useRef();
  const system = useContext(SystemContext);
  const theme = useTheme();
  const classes = system.useSelectStyles({
    theme,
    active: value !== null && value !== void 0,
    focus: dropdown === SHOW,
  });
  useLayoutEffect(() => {
    if (dropdown === SHOW) {
      if (search) {
        selectedRef.current.focus();
      }
      const handler = ({ target }) => {
        if (!wrapperRef.current.contains(target)) {
          setDropdown(CANCEL_HIDE);
          setKw("");
        }
      };
      document.addEventListener("click", handler);
      return () => {
        document.removeEventListener("click", handler);
      };
    } else if (dropdown === SELECT_HIDE) {
			selectedRef.current.focus()
		}
  }, [dropdown]);
  const [popperElement, setPopperElement] = useState(null);


  const { styles } = usePopper(wrapperRef.current, popperElement, {
    strategy: "fixed",
    modifiers: search ? [minWidth, maxSize, applyMaxSize] : [minWidth, preventOverflow],
  });
  const [kw, setKw] = useState("");
  const optionElems = options
    .filter((option) => (dropdown !== SHOW) || (search?.(option, kw) ?? true))
    .map(children);
  return (
    <Context.Provider
      value={{value, onChange: (v) => {
        if (onChange) onChange(v);
        setDropdown(SELECT_HIDE);
      }}}
    >
      <div
        style={style}
        ref={wrapperRef}
        className={cx(classes.wrapper, className)}
        onClick={() => {
          if (dropdown !== SHOW) setDropdown(SHOW);
        }}
      >
        <Container
          ref={selectedRef}
          value={value}
          options={optionElems}
          classes={classes}
          show={dropdown}
          search={search}
          kw={kw}
          setKw={setKw}
          {...props}
        />
        <AnimatePresence>
          {dropdown === SHOW && (
            <DropDown
              ref={setPopperElement}
              style={styles.popper}
              options={optionElems}
              classes={classes}
            />
          )}
        </AnimatePresence>
      </div>
    </Context.Provider>
  );
};

export const Option = ({ children, value }) => {
  const {value: selectedValue, onChange} = useContext(Context);
  const active = value == selectedValue
  const system = useContext(SystemContext);
  const theme = useTheme();
  const classes = system.useListItemStyles({ active, theme });
  return (
    <div className={classes.listItem} onClick={() => onChange(value)}>
      {children}
    </div>
  );
};
