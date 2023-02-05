import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { TYPE, ExternalLink } from 'theme'
import { getExplorerLink } from 'utils'

const StyledPolling = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  right: 0;
  bottom: 0;
  padding: 1rem;
  transition: color 250ms ease 0s;
  color: var(--color-brand);

  :hover {
    opacity: 1;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

const StyledPollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-left: 8px;
  border-radius: 50%;
  position: relative;
  background-color: var(--color-brand);
  transition: background-color 250ms ease 0s;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid var(--color-brand);
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;
  transition: 250ms ease border-color;
  left: -3px;
  top: -3px;
`

export default function Polling({ chainId, blockNumber }: { chainId?: number; blockNumber?: number }) {
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    const timer1 = setTimeout(() => setIsMounted(true), 1_000)

    return () => {
      setIsMounted(false)
      clearTimeout(timer1)
    }
  }, [blockNumber])

  return chainId && blockNumber ? (
    <ExternalLink href={chainId && blockNumber ? getExplorerLink(chainId, blockNumber.toString(), 'block') : ''}>
      <StyledPolling>
        <TYPE.small style={{ opacity: isMounted ? '0.5' : '1' }}>{blockNumber}</TYPE.small>
        <StyledPollingDot>{!isMounted && <Spinner />}</StyledPollingDot>
      </StyledPolling>
    </ExternalLink>
  ) : null
}
