import styled from "@emotion/styled";

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  align-items: flex-end;
  border-bottom: 1px solid var(--vscode-dropdown-border);
`;

export const Link = styled.a`
  cursor: pointer;
  border-bottom: 1px solid transparent;
  :hover {
    border-bottom: 1px solid var(--vscode-textLink-activeForeground);
  }
  padding-bottom: 2px;
`;