import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { ArrowUpRight } from 'react-feather'
import { useDarkModeManager } from 'state/user/hooks'
import styled from 'styled-components/macro'
import { ExternalLink, HideSmall } from 'theme'
import networks from 'networks.json'

import { AutoRow } from '../Row'

const BodyText = styled.div`
  color: ${({ color }) => color};
  margin: 8px;
  font-size: 14px;
`

const TextRows = styled(AutoRow)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const RootWrapper = styled.div`
  position: relative;
  margin-top: 16px;
`

const ContentWrapper = styled.div<{ color: string; colorSoft: string; darkMode: boolean; logoUrl?: string }>`
  background-image: ${({ colorSoft }) => `linear-gradient(135deg, ${colorSoft} 0%, rgba(255, 255, 255, 0) 100%)`};
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  position: relative;
  width: 100%;
  transition: 0.1s;

  :hover {
    opacity: 0.7;
  }
`
const Header = styled.h2`
  font-weight: 600;
  font-size: 16px;
  margin: 0;
`

const LinkOutToBridge = styled(ExternalLink)`
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
  width: 24px;
  height: 24px;
`

export default function NetworkAlert() {
  const { chainId } = useWeb3React()
  const [darkMode] = useDarkModeManager()

  //@ts-ignore
  const { bridge, name, color, colorSoft } = networks[String(chainId) as keyof typeof networks]

  return bridge ? (
    <RootWrapper>
      <ContentWrapper color={color} colorSoft={colorSoft} darkMode={darkMode}>
        <LinkOutToBridge href={bridge}>
          <BodyText color={color}>
            <TextRows>
              <Header>{name} token bridge</Header>
              <HideSmall>Deposit tokens to the {name} network.</HideSmall>
            </TextRows>
          </BodyText>
          <StyledArrowUpRight color={color} />
        </LinkOutToBridge>
      </ContentWrapper>
    </RootWrapper>
  ) : null
}
