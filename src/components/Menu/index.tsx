import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RiArrowRightUpLine } from 'react-icons/ri'
import { ChevronUp, ChevronDown, ChevronRight, ChevronLeft, Moon, Sun } from 'react-feather'
import Identicon from 'components/Identicon'
import i18n, { availableLanguages, LANG_NAME } from '../../i18n'
import { useDarkModeManager } from 'state/user/hooks'
import { useETHBalances } from 'state/wallet/hooks'
import { shortenAddress } from 'utils'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { ApplicationModal, setAppManagement } from 'state/application/actions'
import { useModalOpen, useToggleModal, useAppState } from 'state/application/hooks'
import { ExternalLink } from 'theme'
import { useActiveWeb3React } from 'hooks'
import networks from 'networks.json'

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

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--color-background-interactive);
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

const MenuFlyout = styled.span`
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
  transition: 0.12s;
  border-radius: 12px;
  width: 320px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  top: 54px;
  right: 6px;
  background-color: var(--color-background-surface);
  border: 1px solid var(--color-background-outline);
  box-shadow: var(--color-modal-shadow);
  padding: 16px;
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

export const ClickableMenuItem = styled.a<{ active: boolean }>`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  transition: 0.2s;

  :hover,
  :focus {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }

  > svg {
    margin-right: 8px;
  }
`

const ReturnButton = styled.button`
  cursor: pointer;
  padding: 0 0 0 0.4rem;
  border: none;
  text-align: left;
  font-size: 1.4rem;
  background-color: transparent;
  color: ${({ theme }) => theme.text1};
`

function LanguageMenu({ close }: { close: VoidFunction }) {
  return (
    <MenuFlyout>
      <div>
        <ReturnButton onClick={close}>
          <ChevronLeft size={20} color="var(--color-text-secondary)" />
        </ReturnButton>
        Language
      </div>

      {availableLanguages.map((lang) => (
        <ClickableMenuItem active={i18n.language === lang} key={lang} onClick={() => i18n.changeLanguage(lang)}>
          {LANG_NAME[lang] || lang.toUpperCase()}
        </ClickableMenuItem>
      ))}
    </MenuFlyout>
  )
}

const chevronProps = {
  size: 20,
  color: 'var(--color-text-secondary)',
}

const getChevron = (isActive: boolean) => {
  return isActive ? <ChevronUp {...chevronProps} /> : <ChevronDown {...chevronProps} />
}

export default function Menu() {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const { admin, menuLinks } = useAppState()
  const dispatch = useDispatch()

  // @ts-ignore
  const networkConfig = networks[chainId]
  const baseCoinBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isAdmin, setIsAdmin] = useState<boolean>(account?.toLowerCase() === admin?.toLowerCase())

  useEffect(() => {
    setIsAdmin(account?.toLowerCase() === admin?.toLowerCase())
  }, [account, admin])

  const openSettings = () => {
    dispatch(setAppManagement({ status: true }))
  }

  const node = useRef<HTMLDivElement>()
  const [menu, setMenu] = useState<'main' | 'lang' | 'transaction'>('main')
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  useEffect(() => setMenu('main'), [open])
  useOnClickOutside(node, open ? toggle : undefined)

  /* 
  if !connected return 

    connect | shavron
    menu: connect
          lang
          theme
  */

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        {!!account ? (
          <>
            <Identicon />
            {shortenAddress(account)}
            {getChevron(open)}
          </>
        ) : (
          <>
            {t('connect')} | {getChevron(open)}
          </>
        )}
      </StyledMenuButton>

      {open && (
        <>
          {menu === 'lang' ? (
            <LanguageMenu close={() => setMenu('main')} />
          ) : menu === 'transaction' ? (
            <div>transactions</div>
          ) : (
            <MenuFlyout>
              {/* header: jazzi icon + address + copy + addr explorer + dissconnect */}
              {account && baseCoinBalance && (
                <>
                  {t('balance')}
                  {baseCoinBalance?.toSignificant(5)} {networkConfig?.baseCurrency?.symbol}
                  {/* @todo: add fiat balance */}
                  <Separator />
                </>
              )}
              <MenuButton onClick={() => setMenu('transaction')}>
                {t('transactions')}
                {/* @todo add pending state */}
                <IconWrapper>
                  <ChevronRight size={16} />
                </IconWrapper>
              </MenuButton>
              <MenuButton onClick={() => setMenu('lang')}>
                {t('language')}{' '}
                <div>
                  {/* @todo add current locale display */}
                  <IconWrapper>
                    <ChevronRight size={16} />
                  </IconWrapper>
                </div>
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
              {isAdmin && <MenuButton onClick={openSettings}>{t('manage')}</MenuButton>}
            </MenuFlyout>
          )}
        </>
      )}
    </StyledMenu>
  )
}
