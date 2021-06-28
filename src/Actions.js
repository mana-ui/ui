import React, { useContext } from "react";
import SystemContext from "./SystemContext";

const Actions = (props) => {
  const { Actions } = useContext(SystemContext);
  return <Actions {...props}/>;
};

export default Actions;
