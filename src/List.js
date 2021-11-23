import styled from "@emotion/styled";
import Interactive from "./Interactive";
import { css } from "@emotion/react";

const ListItem = ({ children, isActive, onClick }) => {
  return (
    <Interactive isActive={isActive}>
      <div
        onClick={onClick}
        css={css`
          position: relative;
          z-index: 1;
          height: 48px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          text-decoration: none;
          transition: color 15ms linear;
        `}
      >
        {children}
      </div>
    </Interactive>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export { List, ListItem };
