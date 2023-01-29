/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
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

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row-reverse;
    align-items: center;
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

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0;
    margin-left: 4%;
    margin-right: auto;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: fixed;
    flex-wrap: wrap;
    margin-left: 0;
    bottom: 0;
    padding: 0.6rem;
    width: 100%;
    left: 0%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: var(--box-shadow);
    background-color: var(--color-background-elements);
  `};
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
  width: 100%;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
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
    background-color: var(--color-nav-link-background-hover);
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 10rem;
    width: 100%;
    margin: .1rem;
    padding: 0.4rem 6%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${({ theme }) => theme.bg3};
    font-size: 1.1em;
  `};
`

const StyledExternalLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  font-size: 0.9rem;
  width: fit-content;
  font-weight: 500;
  color: var(--color-notice);
  transition: 0.12s;
  word-break: keep-all;
  white-space: nowrap;
  margin: 4px 0;
  padding: 8px 16px;
  line-height: 24px;
  border-radius: 12px;

  &:not(:last-child) {
    margin-right: 0.16rem;
  }

  &:hover {
    background-color: var(--color-nav-link-background-hover);
  }

  &.${activeClassName} {
    color: ${({ theme }) => theme.text1};
    background-color: var(--color-nav-link-background-hover);
  }

  .name {
    margin-right: 0.1rem;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 10rem;
    width: 100%;
    margin: .1rem;
    padding: 0.4rem 6%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${({ theme }) => theme.bg3};
    font-size: 1.1em;
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

          <StyledExternalLink href="https://t.me/PremiumCoffee_Bot" target="_blank">
            <span className="name">Airdrop</span> <RiArrowRightUpLine />
          </StyledExternalLink>
          <StyledExternalLink href="https://staking.premium.coffee" target="_blank">
            <span className="name">Стэйкинг</span> <RiArrowRightUpLine />
          </StyledExternalLink>
          <StyledExternalLink href="https://farming.premium.coffee" target="_blank">
            <span className="name">Фарминг</span> <RiArrowRightUpLine />
          </StyledExternalLink>

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
          <NetworkSelector chainId={chainId} />
          <Menu />
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}
