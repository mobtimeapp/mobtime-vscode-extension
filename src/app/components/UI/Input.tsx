import React, { HTMLProps } from 'react';
import styled from '@emotion/styled';

export interface InputProps extends HTMLProps<HTMLInputElement> {
  errorMessage?: string;
}

export const Input: React.FC<InputProps> = ({ errorMessage, ...inputProps }) => {
  return <div>
    <input 
      {...inputProps}
    />
    <Underline
      style={{
        width: errorMessage ? "100%" : "0%"
      }}
    />
    {errorMessage && (
      <Error>{errorMessage}</Error>
    )}
  </div>;
};

export const Underline = styled.div`
  width: 0%;
  height: 2px;
  display: block;
  background-color: red;
  bottom: 0px;
  transition: width 1s ease-in-out;
  z-index: 10;
`;

export const Error = styled.p`
  margin-top: 4px;
  font-size: 12px;
  color: red;
`;