import React, { createContext, useContext } from "react";
import SystemContext from "./SystemContext";
import cx from "classnames";

const Context = createContext();

const Container = ({ columnProps, data, rowKey, className }) => {
  const system = useContext(SystemContext);
  const classes = system.useDataGridStyles();
  const headers = [],
    columns = [];
  for (const { header, render, key: k } of columnProps) {
    let key = k ?? typeof render === "function" ? null : render;
    headers.push({ header, key });
    if (typeof render === "function") {
      columns.push({ render, key });
    } else {
      columns.push({ render: (d) => d[render], key });
    }
  }
  return (
    <div className={cx(classes.container, className)}>
      <table className={classes.table}>
        <thead>
          <tr className={classes.headerRow}>
            {headers.map(({ header, key }) => (
              <th key={key} className={cx(classes.cell, classes.th)}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={classes.tbody}>
          {data.map((d) => (
            <tr key={d[rowKey]} className={classes.tr}>
              {columns.map(({ render, key }) => (
                <td key={key} className={cx(classes.cell, classes.td)}>
                  {render(d)}
                </td>
              ))}
            </tr>
          ))}
          <tr></tr>
        </tbody>
      </table>
    </div>
  );
};

export const DataGrid = ({ children, ...props }) => {
  const columns = [];
  const setColumn = (column) => {
    columns.push(column);
  };
  return (
    <Context.Provider value={setColumn}>
      {children}
      <Container columnProps={columns} {...props} />
    </Context.Provider>
  );
};

export const Column = (props) => {
  const setColumn = useContext(Context);
  setColumn(props);
  return null;
};
