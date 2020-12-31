import React, {
  createContext,
  forwardRef,
  Suspense,
  useContext,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const Context = createContext(() => null);

const tableType = Symbol("table");
const theadType = Symbol("thead");
const thType = Symbol("th");
const trType = Symbol("tr");
const PENDING = 1;

const ThContainer = ({ childType, resolveRef, children }) => {
  const ref = (node) => {
    resolveRef.current(node);
  };
  if (childType === thType) {
    return (
      <THead>
        <Tr ref={ref}>{children}</Tr>
      </THead>
    );
  } else if ( childType === trType) {
      return <THead>{children}</THead>
  }
  return children;
};

export const Table = ({ children }) => {
  const [childType, setChildType] = useState(null);
  const resolveRef = useRef();
  const promiseRef = useRef(
    new Promise((resolve) => {
      if (!resolveRef.current) {
        resolveRef.current = resolve;
      }
    })
  );
  return (
    <Context.Provider
      value={{
        parent: tableType,
        getThContainer: (childType) => {
          setChildType((x) => {
            if (x !== childType) {
              return childType;
            }
            return x;
          });
          return promiseRef.current;
        },
      }}
    >
      <table>
        <ThContainer childType={childType} resolveRef={resolveRef} ></ThContainer>
        {children}
      </table>
    </Context.Provider>
  );
};

export const THead = ({ children, id }) => {
  const [childType, setChildType] = useState(null);
  const resolveRef = useRef();
  const promiseRef = useRef(
    new Promise((resolve) => {
      if (!resolveRef.current) {
        resolveRef.current = resolve;
      }
    })
  );
  return (
    <Context.Provider
      value={{
        getThContainer: (childType) => {
          setChildType((x) => {
            if (x !== childType) {
              return childType;
            }
            return x;
          });
          return promiseRef.current;
        },
        parent: theadType,
      }}
    >
      <thead id={id}>
        {childType === thType ? (
          <Tr ref={resolveRef.current}>{children}</Tr>
        ) : (
          children
        )}
      </thead>
    </Context.Provider>
  );
};

export const TBody = ({ children }) => <tbody>{children}</tbody>;

export const Th = ({ children }) => {
  const { getThContainer, parent } = useContext(Context);
  const th = <th>{children}</th>;
  if (parent === tableType || parent === theadType) {
    const Component = React.lazy(async () => {
      const container = await getThContainer(thType);
      return {
        default: () => createPortal(th, container),
      };
    });
    return (
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    );
  } else {
    return th;
  }
};

export const Tr = forwardRef(({ children, id }, ref) => {
  const { getThContainer, parent } = useContext(Context);
  const tr = (
    <Context.Provider value={{ parent: trType, getThContainer }}>
      <tr ref={ref} id={id}>{children}</tr>
    </Context.Provider>
  );
  if (parent !== theadType) {
    const Component = React.lazy(async () => {
      const container = await getThContainer(trType);
      return { default: () => createPortal(tr, container) };
    });
    return (
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    );
  }
  return tr;
});

export const Td = ({ children }) => <td>{children}</td>;
