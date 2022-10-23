import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 28rem;
  width: 100%;
  border-radius: 1.2rem;
  border: 1px solid ${({ theme }) => theme.text5};
  box-shadow: .3rem 12px 24px ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90%;
  `}
`

export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
