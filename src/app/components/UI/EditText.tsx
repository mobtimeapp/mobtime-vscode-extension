import React, {  useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Input, InputProps } from './Input';
import { Button } from './Button';
import { VscCheck, VscClose } from 'react-icons/vsc';

interface EditTextProps {
  defaultText: string;
  onChange: (text: string) => void;
  onDone: () => void;
  inputProps?: InputProps;
}

export const EditText: React.FC<EditTextProps> = ({ onChange, defaultText, onDone, inputProps }) => {
  const [text, setText] = useState(defaultText);
  const isTextValid = useMemo(() => text.length > 0, [text]);
  const isTextChanged = useMemo(() => text !==  defaultText, [text, defaultText]);

  const handleSubmit = useCallback(() => {
    onChange(text);
    onDone();
  }, [text, onChange, onDone]);

  const handleCancel = useCallback(() => {
    setText(defaultText);
    onDone();
  }, [defaultText, onChange, onDone]);

  return <div>
    <EditInput
      value={text}
      errorMessage={!isTextValid ? "Required to fill" : undefined}
      onChange={e => setText(e.currentTarget.value)}
      autoFocus
      {...inputProps}
    />
    <Buttons>
      <Button
        style={{
          opacity: isTextValid && isTextChanged ? 1 : 0.5
        }}
        disabled={!isTextValid && isTextChanged}
        onClick={handleSubmit}
      >
        <VscCheck />
      </Button>
      <Button 
        className="secondary"
        onClick={handleCancel}
      >
        <VscClose />
      </Button>
    </Buttons>
  </div>;
};

const Buttons = styled.div`
  display: flex;
  margin-top: 4px;
  button {
    :nth-child(1) {
      margin-right: 10px;
    };
    width: 30px;
    height: 30px;
    svg {
      margin: 0px !important;
      width: 20px;
      height: 20px;
      margin-right: 0px;
    }
  }
`;

const EditInput = styled(Input)`
  font: inherit !important;
  padding: 0px !important;
  padding-bottom: 5px !important;
  outline: none !important;
  background-color: inherit !important;
  border-bottom: 1px solid var(--vscode-focusBorder) !important;
`;