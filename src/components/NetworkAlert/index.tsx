import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { ArrowUpRight } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useDarkModeManager } from 'state/user/hooks'
import styled from 'styled-components/macro'
import { ExternalLink, HideSmall } from 'theme'
import networks from 'networks.json'
import { CURRENCY } from 'assets/images'

import { AutoRow } from '../Row'

const BodyText = styled.div`
  display: flex;
  align-items: center;
  margin: 8px;
  font-size: 14px;
  color: ${({ color }) => color};
`

const StyledNetworkImg = styled.img`
  width: 24px;
  margin-right: 0.8rem;
`

const TextRows = styled(AutoRow)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const RootWrapper = styled.div`
  position: relative;
  margin-top: 16px;

  @media (max-width: 540px) {
    margin: 16px auto 0;
    width: 90%;
  }
`

const ContentWrapper = styled.div<{
  color: string
  colorSoft: string
  darkMode: boolean
  logoUrl?: string
  chainId?: number
}>`
  background-image: ${({ colorSoft }) =>
    `radial-gradient(182.71% 205.59% at 2.81% 7.69%, ${colorSoft} 0%, var(--color-currency-search-item-hover) 100%)`};
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  position: relative;
  width: 100%;
  transition: 0.1s;
  overflow: hidden;

  :hover {
    opacity: 0.7;
  }

  ::before {
    background-image: url(${({ chainId }) => (chainId ? CURRENCY[chainId as keyof typeof CURRENCY] : '')});
    background-repeat: no-repeat;
    background-size: 300px;
    content: '';
    height: 300px;
    opacity: 0.15;
    position: absolute;
    transform: rotate(25deg) translate(-90px, -40px);
    width: 300px;
  }
`
const Header = styled.h2`
  font-weight: 600;
  font-size: 16px;
  margin: 0;
`

const LinkOutToBridge = styled(ExternalLink)`
  position: relative;
  z-index: 1;
  align-items: center;
  border-radius: 8px;
  color: white;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  padding: 6px 8px;
  margin-right: 12px;
  text-decoration: none !important;
  width: 100%;
`

const StyledArrowUpRight = styled(ArrowUpRight)`
  margin-left: 12px;
  width: 16px;
  height: 16px;
`

export default function NetworkAlert() {
  const { t } = useTranslation()
  const { chainId } = useWeb3React()
  const [darkMode] = useDarkModeManager()

  // @ts-ignore
  const { bridge, name, color, colorSoft } = networks[String(chainId) as keyof typeof networks]

  return bridge ? (
    <RootWrapper>
      <ContentWrapper color={color} colorSoft={colorSoft} darkMode={darkMode} chainId={chainId}>
        <LinkOutToBridge href={bridge}>
          <BodyText color={color}>
            {CURRENCY[String(chainId) as keyof typeof networks] && (
              <StyledNetworkImg src={CURRENCY[String(chainId) as keyof typeof networks]} alt="Network logo" />
            )}
            <TextRows>
              <Header>
                {name} {t('tokenBridge')}
              </Header>
              <HideSmall>{t('depositTokensToNetwork', { network: name })}.</HideSmall>
            </TextRows>
          </BodyText>
          <StyledArrowUpRight color={color} />
        </LinkOutToBridge>
      </ContentWrapper>
    </RootWrapper>
  ) : null
}
