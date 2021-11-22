import React from "react";
import { css } from "@emotion/react";
import Interactive from "./Interactive";
import { useTheme } from "@emotion/react";

const Radio = ({ checked = false, disabled, ...props }) => {
  const theme = useTheme()
  const color = disabled ? theme.color.disabled: theme.color.primary
  return (
    <Interactive
      rippleCenter
      disabled={disabled}
      css={css`
        display: inline-block;
        padding: 10px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
      `}
    >
      <input
        {...props}
        checked={checked}
        disabled={disabled}
        type="radio"
        css={css`
          position: absolute;
          opacity: 0;
          top: calc((40px - 40px) / 2);
          right: calc((40px - 40px) / 2);
          left: calc((40px - 40px) / 2);
          width: 40px;
          height: 40px;
          z-index: 1;
          cursor: inherit;
          margin: 0;
        `}
      />
      <div
        css={css`
          display: inline-block;
          width: 20px;
          height: 20px;
          position: relative;
        `}
      >
        <div
          css={css`
            border-radius: 50%;
            border-width: 2px;
            border-style: solid;
            border-color: ${checked ? color : "rgba(0,0,0,.54)"};
            position: absolute;
            top; 0;
            left: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
          `}
        ></div>
        <div
          css={css`
            border-radius: 50%;
            border: 10px solid ${color};
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform: scale(${checked ? 0.5 : 0});
            box-sizing: border-box;
            transition: transform 120ms 0ms cubic-bezier(0, 0, 0.2, 1), border-color 120ms 0ms cubic-bezier(0, 0, 0.2, 1);
          `}
        ></div>
      </div>
    </Interactive>
  );
};

export default Radio;
