import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 470px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 8px;
  border-radius: var(--main-component-border-radius);
  border: 1px solid var(--color-background-outline);
  background-color: var(--color-background-surface);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90%;
  `}
`

export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
