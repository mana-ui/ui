import styled from "@emotion/styled";
import { useRipple } from "@mana-ui/lib";
import React from "react";
import { useTheme } from ".";

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  color: ${({
    theme: {
      color: { primary },
    },
    isActive,
  }) => (isActive ? primary : "currentColor")};
`;

const Background = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: ${({ isActive }) => (isActive ? 0.12 : 0)};
  background: ${({
    theme: {
      color: { primary },
    },
  }) => primary};
  transition: opacity 15ms linear, background-color 15ms linear;
  ${Wrapper}:hover & {
    opacity: 0.04;
  }
  ${Wrapper}:focus-within & {
    opacity: 0.12;
  }
`;

const Interactive = ({
  children,
  rippleCenter,
  disabled,
  isActive,
  ...props
}) => {
  const theme = useTheme();
  const [surface, ripple] = useRipple({
    color: theme.color.primary,
    center: rippleCenter,
    disabled,
  });
  return (
    <Wrapper {...props} ref={surface} isActive={isActive}>
      {children}
      {ripple}
      <Background ref={surface} isActive={isActive} />
    </Wrapper>
  );
};

export default Interactive;
