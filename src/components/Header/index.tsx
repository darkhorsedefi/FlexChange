/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import Logo from 'assets/images/logo.svg'
import { RiArrowRightUpLine } from 'react-icons/ri'
import { useActiveWeb3React } from 'hooks'
import { useAppState } from 'state/application/hooks'
import Row, { RowFixed } from '../Row'
import Menu from 'components/Menu'
import NetworkSelector from './NetworkSelector'

const HeaderFrame = styled.header`
  width: 100vw;
  height: 72px;
  padding: 20px 12px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const StyledNetworkSelectorWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: fixed;
    left: 70px;
    top: 14px;
  `};
`

const HeaderRow = styled(RowFixed)`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `};
`

const NavlLinks = styled(Row)`
  width: auto;
  padding: 0.3rem;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    font-size: 0.9rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0;
    margin-left: 4%;
    margin-right: auto;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: fixed;
    margin-left: 0;
    bottom: 0;
    width: 100vw;
    padding: 4px 8px;
    left: 0;
    overflow-x: auto;
    border-top: 1px solid var(--color-background-outline);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background-color: var(--color-background-surface);
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    justify-content: space-between;
  `}
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
`

const Icon = styled.div`
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
`

const LogoImage = styled.img`
  width: 70%;
`

const activeClassName = 'ACTIVE'

const linkStyles = css`
  display: flex;
  flex-flow: row nowrap;
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: var(--color-notice);
  width: fit-content;
  margin: 4px 0;
  padding: 8px 16px;
  line-height: 24px;
  border-radius: 12px;
  font-weight: 500;
  transition: 0.12s;

  &:not(:last-child) {
    margin-right: 0.16rem;
  }

  &:hover {
    background-color: var(--color-nav-link-background-hover);
  }

  &.${activeClassName} {
    color: ${({ theme }) => theme.text1};
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 1px 0;
    padding: 4px 10px;
    line-height: 22px;

    &:not(:last-child) {
      margin-right: 0.08rem;
    }
  `};

  ${({ theme }) => theme.mediaWidth.mobile`
    margin: 4px 0;
    padding: 8px 16px;
    line-height: 24px;

    &:not(:last-child) {
      margin-right: 0.16rem;
    }
  `};
`

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${linkStyles}
`

const StyledExternalLink = styled.a`
  ${linkStyles}
  align-items: center;
`

const StyledExternalLinkButton = styled.a`
  ${linkStyles}
  align-items: center;
  background-color: var(--color-nav-link-background-hover);

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    font-size: 0.9rem;
  `};

  ${({ theme }) => theme.mediaWidth.mobile`
    display: none;
  `};
`

const StyledShowOnMobile = styled.div`
  display: none;

  ${({ theme }) => theme.mediaWidth.mobile`
    display: contents;
  `};
`

export default function Header() {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { navigationLinks } = useAppState()

  return (
    <HeaderFrame>
      <HeaderRow>
        <Title href=".">
          <Icon>
            <LogoImage src={Logo} alt="logo" />
          </Icon>
        </Title>
        <NavlLinks>
          <StyledNavLink id="header-swap-nav-link" to={'/swap'}>
            {t('swap')}
          </StyledNavLink>
          <StyledNavLink
            id="header-pool-nav-link"
            to="/pool"
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            {t('pool')}
          </StyledNavLink>

          <StyledExternalLink href="https://www.miningtaxi.com/driver" target="_blank">
            <span className="name">Driver</span> <RiArrowRightUpLine />
          </StyledExternalLink>
          <StyledExternalLink href="https://www.miningtaxi.com/rider" target="_blank">
            <span className="name">Rider</span> <RiArrowRightUpLine />
          </StyledExternalLink>
          <StyledExternalLink href="https://www.miningtaxi.com/community" target="_blank">
            <span className="name">Community</span> <RiArrowRightUpLine />
          </StyledExternalLink>
          <StyledExternalLink href="https://www.miningtaxi.com/crypto" target="_blank">
            <span className="name">Crypto</span> <RiArrowRightUpLine />
          </StyledExternalLink>

          <StyledShowOnMobile>
            <StyledExternalLink href="https://www.miningtaxi.com/earning" target="_blank">
              <span className="name">Earning</span> <RiArrowRightUpLine />
            </StyledExternalLink>
            <StyledExternalLink href="https://www.miningtaxi.com/governance" target="_blank">
              <span className="name">Governance</span> <RiArrowRightUpLine />
            </StyledExternalLink>
          </StyledShowOnMobile>

          {Boolean(navigationLinks.length) &&
            navigationLinks.map((item: { source: string; name: string }, index) => (
              <StyledExternalLink href={item.source} key={index} target="_blank">
                <span className="name">{item.name}</span> <RiArrowRightUpLine />
              </StyledExternalLink>
            ))}
        </NavlLinks>
      </HeaderRow>

      <HeaderControls>
        <HeaderElement>
          <StyledExternalLinkButton href="https://www.miningtaxi.com/earning" target="_blank">
            Earning
          </StyledExternalLinkButton>
          <StyledExternalLinkButton href="https://www.miningtaxi.com/governance" target="_blank">
            Governance
          </StyledExternalLinkButton>
          <StyledNetworkSelectorWrapper>
            <NetworkSelector currentChainId={chainId} />
          </StyledNetworkSelectorWrapper>
          <Menu />
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}
