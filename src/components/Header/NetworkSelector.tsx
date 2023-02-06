import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { ChevronUp, ChevronDown, Check } from 'react-feather'
import networks from 'networks.json'
import { useAppState, useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { CURRENCY } from 'assets/images'
import MenuFlyout from 'components/MenuFlyout'

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

const StyledNetworkItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 12px 16px;
  color: var(--color-text-primary);
  transition: 0.12s;
  border-radius: 12px;
  border: none;
  background-color: transparent;

  :hover,
  :focus {
    background-color: var(--color-background-module);
    cursor: pointer;
    text-decoration: none;
  }

  .networkInfo {
    display: flex;
    align-items: center;
  }

  .networkName {
    margin-left: 6px;
    font-size: 18px;
  }
`

const chevronProps = {
  size: 22,
  color: 'var(--color-text-secondary)',
}

export default function NetworkSelector({ currentChainId }: { currentChainId?: number }) {
  const { contracts } = useAppState()

  const node = useRef<HTMLDivElement>()
  const isMenuOpen = useModalOpen(ApplicationModal.NETWORKS)
  const toggleMenu = useToggleModal(ApplicationModal.NETWORKS)

  useOnClickOutside(node, isMenuOpen ? toggleMenu : undefined)

  // @ts-ignore: add types for local JSON files
  const [availableNetworks] = useState<any[]>(Object.keys(contracts).map((chainId) => networks[chainId]))

  const onSelectNetwork = (id: number) => console.log('select a new network', id)

  // @ts-ignore
  const networkConfig = networks[currentChainId]
  // @ts-ignore
  const networkImage = CURRENCY[currentChainId]

  return typeof currentChainId === 'number' && networkConfig ? (
    <StyledWrapper ref={node as any}>
      <StyledMenuToggle title={`${networkConfig.name} network`} onClick={toggleMenu}>
        {networkImage && <StyledNetworkImg src={networkImage} alt={`logo of the ${networkConfig.name} network`} />}
        <StyledName>{networkConfig.name}</StyledName>
        {isMenuOpen ? <ChevronUp {...chevronProps} /> : <ChevronDown {...chevronProps} />}
      </StyledMenuToggle>

      {isMenuOpen && (
        <MenuFlyout padding="8px" width="290px">
          {availableNetworks.map(({ name, chainId }) => (
            <StyledNetworkItem key={chainId} onClick={() => onSelectNetwork(chainId)}>
              <div className="networkInfo">
                {/* @ts-ignore */}
                {!!CURRENCY[chainId] && (
                  <StyledNetworkImg src={networkImage} alt={`logo of the ${name} network`} />
                )}{' '}
                <span className="networkName">{name}</span>
              </div>

              {currentChainId === chainId && <Check color="var(--color-accent-active)" opacity={1} size={20} />}
            </StyledNetworkItem>
          ))}
        </MenuFlyout>
      )}
    </StyledWrapper>
  ) : null
}
