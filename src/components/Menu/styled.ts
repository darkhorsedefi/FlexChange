import styled from 'styled-components'

export const MenuFlyout = styled.div`
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
  transition: 0.12s;
  border-radius: 12px;
  width: 320px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  top: 54px;
  right: 6px;
  background-color: var(--color-background-surface);
  border: 1px solid var(--color-background-outline);
  box-shadow: var(--color-modal-shadow);
  padding: 16px;
`

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
