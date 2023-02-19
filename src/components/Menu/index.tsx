import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RiArrowRightUpLine } from 'react-icons/ri'
import { ChevronUp, ChevronDown, ChevronRight, Moon, Sun, Settings } from 'react-feather'
import i18n from '../../i18n'
import Identicon from 'components/Identicon'
import MenuFlyout from 'components/MenuFlyout'
import { useDarkModeManager } from 'state/user/hooks'
import { shortenAddress } from 'utils'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { ApplicationModal, setAppManagement } from 'state/application/actions'
import { useModalOpen, useToggleModal, useAppState } from 'state/application/hooks'
import { ExternalLink } from 'theme'
import { useActiveWeb3React } from 'hooks'
import MenuHeader from './MenuHeader'
import TransactionMenu from './TransactionMenu'
import LangMenu from './LangMenu'

export const StyledMenuButton = styled.button`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  -webkit-box-align: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 3rem;
  cursor: pointer;
  user-select: none;
  height: 36px;
  margin-right: 2px;
  margin-left: 2px;
  background-color: var(--color-background-module);
  border: 1px solid var(--color-background-module);
  color: var(--color-background-surface-reversed);
  font-weight: 500;
  font-size: 16px;

  :hover {
    border-color: var(--color-background-outline);
  }

  > *:not(:last-child) {
    margin-right: 0.4rem;
  }
`

const StyledMenuAddress = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  transition: 0.12s;
`

const MenuButton = styled.button`
  background-color: transparent;
  margin: 0px;
  border: none;
  cursor: pointer;
  display: flex;
  flex: 1 1 0%;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 400;
  width: 100%;
  padding: 12px 8px;
  color: var(--color-text-secondary);

  :hover,
  :focus {
    color: var(--color-background-surface-reversed);
    background-color: var(--color-background-module);
    transition: all 125ms ease-in 0s;
  }
`

const StyledRow = styled.div`
  display: flex;
  align-items: center;
`

const StyledLangIso = styled.span`
  margin-right: 4px;
`

const MenuItem = styled(ExternalLink)`
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 0.6rem;
  color: ${({ theme }) => theme.text2};
  word-break: keep-all;
  white-space: nowrap;
  font-size: 0.9em;
  transition: 0.2s;
  text-decoration: none;

  :last-child {
    padding-bottom: 0;
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`

const chevronProps = {
  size: 20,
  color: 'var(--color-text-secondary)',
}

const getChevron = (isActive: boolean) => {
  return isActive ? <ChevronUp {...chevronProps} /> : <ChevronDown {...chevronProps} />
}

export default function Menu() {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { admin, menuLinks } = useAppState()
  const dispatch = useDispatch()

  const [isAdmin, setIsAdmin] = useState<boolean>(account?.toLowerCase() === admin?.toLowerCase())

  useEffect(() => {
    setIsAdmin(account?.toLowerCase() === admin?.toLowerCase())
  }, [account, admin])

  const openSettings = () => {
    dispatch(setAppManagement({ status: true }))
  }

  const node = useRef<HTMLDivElement>()
  const [menu, setMenu] = useState<'main' | 'lang' | 'transaction'>('main')

  const openMainMenu = () => setMenu('main')
  const openTransactionMenu = () => setMenu('transaction')
  const openLangMenu = () => setMenu('lang')

  const isMenuOpen = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  useEffect(() => setMenu('main'), [isMenuOpen])
  useOnClickOutside(node, isMenuOpen ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        {!!account ? (
          <>
            <Identicon />
            <StyledMenuAddress>
              {shortenAddress(account)} {getChevron(isMenuOpen)}
            </StyledMenuAddress>
          </>
        ) : (
          <>
            {t('connect')} | {getChevron(isMenuOpen)}
          </>
        )}
      </StyledMenuButton>

      {isMenuOpen && (
        <>
          {menu === 'transaction' ? (
            <TransactionMenu close={openMainMenu} />
          ) : menu === 'lang' ? (
            <LangMenu close={openMainMenu} />
          ) : (
            <MenuFlyout>
              <MenuHeader />
              <MenuButton onClick={openTransactionMenu}>
                {t('transactions')}
                {/* @todo add pending state */}
                <IconWrapper>
                  <ChevronRight size={16} />
                </IconWrapper>
              </MenuButton>
              <MenuButton onClick={openLangMenu}>
                {t('language')}{' '}
                <StyledRow>
                  <StyledLangIso>{i18n.language?.toLocaleUpperCase()}</StyledLangIso>
                  <IconWrapper>
                    <ChevronRight size={16} />
                  </IconWrapper>
                </StyledRow>
              </MenuButton>
              <MenuButton onClick={toggleDarkMode}>
                {darkMode ? (
                  <>
                    {t('lightTheme')}
                    <IconWrapper>
                      <Sun size={16} />
                    </IconWrapper>
                  </>
                ) : (
                  <>
                    {t('darkTheme')}
                    <IconWrapper>
                      <Moon size={16} />
                    </IconWrapper>
                  </>
                )}
              </MenuButton>
              {Boolean(menuLinks?.length) &&
                menuLinks.map((item: { source: string; name: string }, index: number) => (
                  <MenuItem key={index} href={item.source} target="_blank">
                    {item.name} <RiArrowRightUpLine />
                  </MenuItem>
                ))}
              {isAdmin && (
                <MenuButton onClick={openSettings}>
                  {t('manage')}{' '}
                  <IconWrapper>
                    <Settings size={16} />
                  </IconWrapper>
                </MenuButton>
              )}
            </MenuFlyout>
          )}
        </>
      )}
    </StyledMenu>
  )
}
