import React, { useContext } from "react";
import SystemContext from "./SystemContext";
import cx from "classnames";
import styled from '@emotion/styled'

const Container = styled.div`position: relative;`
const Th = styled.th`
	position: sticky;
	top: 0;
	background: #fff;
	box-shadow: inset 0 -1px 0 rgba(0,0,0,.12);
	z-index: 1;
`

export const DataGrid = ({ children,  data=[], rowKey, className, empty = "No Data" }) => {
	const system = useContext(SystemContext);
	const {Empty} = system
  const classes = system.useDataGridStyles();
  return (
      <Container className={cx(classes.container, className)}>
      <table className={classes.table}>
        <thead>
          <tr className={classes.headerTr}>
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
    </Container>
  );
};

export const Column = ({header}) => {
	const system = useContext(SystemContext);
  const classes = system.useDataGridStyles();
  return <Th className={cx(classes.cell, classes.th)}>{header}</Th>;
};
