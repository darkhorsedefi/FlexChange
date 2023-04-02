import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { ChevronUp, ChevronDown, Check } from 'react-feather'
import { UnsupportedChainIdError } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { useActiveWeb3React } from 'hooks'
import { switchInjectedNetwork } from 'utils/wallet'
import { useAppState, useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { CURRENCY } from 'assets/images'
import MenuFlyout from 'components/MenuFlyout'
import networks from 'networks.json'

type SupportedChainId = keyof typeof networks

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
  margin-right: 0.5rem;
`

const StyledName = styled.span`
  margin-right: 0.5rem;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    display: none;
  `};
`

const StyledNetworkItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 12px 8px;
  color: var(--color-text-primary);
  transition: 0.12s;
  border-radius: 12px;
  border: none;
  background-color: transparent;

  :hover,
  :focus {
    background-color: var(--color-background-outline);
    cursor: pointer;
    text-decoration: none;
  }

  .networkInfo {
    display: flex;
    align-items: center;
  }

  .networkName {
    margin-left: 6px;
    font-size: 16px;
  }
`

const chevronProps = {
  size: 22,
  color: 'var(--color-text-secondary)',
}

export default function NetworkSelector({ currentChainId }: { currentChainId?: number }) {
  const { connector, activate } = useActiveWeb3React()
  const { contracts } = useAppState()

  const node = useRef<HTMLDivElement>()
  const isMenuOpen = useModalOpen(ApplicationModal.NETWORKS)
  const toggleMenu = useToggleModal(ApplicationModal.NETWORKS)

  useOnClickOutside(node, isMenuOpen ? toggleMenu : undefined)

  const [availableNetworks] = useState(
    Object.keys(contracts).map((chainId) => networks[chainId as keyof typeof networks])
  )
  const isOnlyOneNetwork = availableNetworks.length === 1

  const onSelectNetwork = async (id: number) => {
    if (currentChainId !== id) {
      if (connector instanceof InjectedConnector) {
        const result = await switchInjectedNetwork(id)

        if (!result) return
      } // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
      else if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
        connector.walletConnectProvider = undefined
      }

      connector &&
        activate(connector, undefined, true).catch((error) => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector)
          }
        })
    }
  }

  const networkConfig = networks[String(currentChainId) as SupportedChainId]
  const networkImage = CURRENCY[String(currentChainId) as SupportedChainId]

  return typeof currentChainId === 'number' && networkConfig ? (
    <StyledWrapper ref={node as any}>
      <StyledMenuToggle title={`${networkConfig.name} network`} onClick={toggleMenu}>
        {networkImage && <StyledNetworkImg src={networkImage} alt={`logo of the ${networkConfig.name} network`} />}
        <StyledName>{networkConfig.name}</StyledName>
        {isOnlyOneNetwork ? null : isMenuOpen ? <ChevronUp {...chevronProps} /> : <ChevronDown {...chevronProps} />}
      </StyledMenuToggle>

      {isMenuOpen && !isOnlyOneNetwork && (
        <MenuFlyout padding="8px" width="260px">
          {availableNetworks.map(({ name, chainId }) => (
            <StyledNetworkItem key={chainId} onClick={() => onSelectNetwork(chainId)}>
              <div className="networkInfo">
                {!!CURRENCY[String(chainId) as SupportedChainId] && (
                  <StyledNetworkImg
                    src={CURRENCY[String(chainId) as SupportedChainId]}
                    alt={`logo of the ${name} network`}
                  />
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
