import styled from 'styled-components'

export const StyledMenuHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 2vh;
  color: var(--color-text-secondary);
`

export const ReturnButton = styled.button`
  cursor: pointer;
  padding: 0 0 0 0.4rem;
  border: none;
  text-align: left;
  font-size: 1.4rem;
  background-color: transparent;
  color: var(--color-text-secondary);
  flex: 0.5;
  transition: 0.1s;

  :hover {
    color: var(--color-text-primary);
  }
`

export const ClickableMenuItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 12px 16px;
  color: var(--color-text-primary);
  transition: 0.12s;
  border-radius: 6px;

  :hover,
  :focus {
    background-color: var(--color-background-module);
    cursor: pointer;
    text-decoration: none;
  }

  > svg {
    margin-right: 8px;
  }
`
