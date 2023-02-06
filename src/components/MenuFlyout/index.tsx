import React, { ReactNode } from 'react'
import styled from 'styled-components'

const StyledMenuFlyout = styled.div<{ padding?: string; width?: string }>`
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
  transition: 0.12s;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  top: 54px;
  right: 6px;
  background-color: var(--color-background-surface);
  border: 1px solid var(--color-background-outline);
  box-shadow: var(--color-modal-shadow);
  width: ${({ width }) => width || '320px'};
  padding: ${({ padding }) => padding || '16px'};
`

export default function MenuFlyout({
  children,
  padding,
  width,
}: {
  children: ReactNode
  padding?: string
  width?: string
}) {
  return (
    <StyledMenuFlyout padding={padding} width={width}>
      {children}
    </StyledMenuFlyout>
  )
}
