import React, { useState } from 'react'
import styled from 'styled-components'
import { ChevronUp, ChevronDown } from 'react-feather'
import networks from 'networks.json'
import { CURRENCY } from 'assets/images'

const StyledWrapper = styled.div`
  position: relative;
`

const StyledMenuToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: var(--color-text-primary);
  width: fit-content;
  margin: 4px 0;
  padding: 8px;
  line-height: 24px;
  border-radius: 12px;
  font-weight: 500;
  border: none;
  font-size: inherit;
  background-color: transparent;
  transition: 0.12s;

  &:hover {
    background-color: var(--color-nav-link-background-hover);
  }
`

const StyledNetworkImg = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 0.3rem;
`

const StyledName = styled.span`
  margin-right: 0.5rem;
`

const StyledNetworks = styled.div`
  position: absolute;
`

const chevronProps = {
  size: 22,
  color: 'var(--color-text-secondary)',
}

export default function NetworkSelector({ chainId }: { chainId?: number }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  // @ts-ignore
  const networkConfig = networks[chainId]
  // @ts-ignore
  const networkImage = CURRENCY[chainId]

  return typeof chainId === 'number' && networkConfig ? (
    <StyledWrapper>
      <StyledMenuToggle title={`${networkConfig.name} network`} onClick={toggleMenu}>
        {networkImage && <StyledNetworkImg src={networkImage} alt="network logo" />}
        <StyledName>{networkConfig.name}</StyledName>
        {isOpen ? <ChevronUp {...chevronProps} /> : <ChevronDown {...chevronProps} />}
      </StyledMenuToggle>

      {isOpen && (
        <StyledNetworks>
          Networks...
          {/* @todo */}
        </StyledNetworks>
      )}
    </StyledWrapper>
  ) : null
}
