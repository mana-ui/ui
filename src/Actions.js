import React, { useContext } from "react";
import SystemContext from "./SystemContext";

const Actions = ({ children }) => {
  const { Actions } = useContext(SystemContext);
  return <Actions>{children}</Actions>;
};

export default Actions;
