import React, { useContext } from "react";
import SystemContext from "./SystemContext";
import cx from "classnames";


export const DataGrid = ({ children,  data=[], rowKey, className, empty = "No Data" }) => {
	const system = useContext(SystemContext);
	const {Empty} = system
  const classes = system.useDataGridStyles();
  return (
      <div className={cx(classes.container, className)}>
      <table className={classes.table}>
        <thead>
          <tr className={classes.headerRow}>
						{children}
          </tr>
        </thead>
        <tbody className={classes.tbody}>
          {data.length > 0 ? data.map((d) => (
            <tr key={d[rowKey]} className={classes.tr}>
							{React.Children.map(children, ({props: {render}}) => {
								if (typeof render!=='function') {
									let r = render
									render = d => d[r]
								}
							return <td className={cx(classes.cell, classes.td)}>{render(d)}</td>
							})}
            </tr>
          )): <tr className={classes.tr}><td colSpan={React.Children.count(children)}><Empty>{empty}</Empty></td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export const Column = ({header}) => {
	const system = useContext(SystemContext);
  const classes = system.useDataGridStyles();
  return <th className={cx(classes.cell, classes.th)}>{header}</th>;
};
