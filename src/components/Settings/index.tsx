import React, { useContext, useRef, useState } from 'react'
import { Settings, X } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext, keyframes } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from 'state/application/hooks'
import {
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
} from 'state/user/hooks'
import { TYPE } from 'theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledMenuIcon = styled(Settings)`
  height: 35px;
  width: 35px;
  padding: 0.4rem;
  border-radius: 50%;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }

  :hover {
    background-color: ${({ theme }) => theme.bg2};
    animation: ${rotate} 2s linear infinite;
  }
`

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  border: none;
  margin: 0;
  padding: 0;
  height: 35px;
  border-radius: 0.5rem;
  background-color: transparent;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`
const EmojiWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0px;
  font-size: 14px;
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.div`
  min-width: 20.125rem;
  background-color: var(--color-background-elements);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border: 1px solid var(--color-border);
  border-radius: var(--main-component-border-radius);
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 2.4rem;
  right: 0.3rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 18.125rem;
  `};
`

const Break = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`

const ModalContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
`

export default function SettingsTab() {
  const { t } = useTranslation()
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()

  const theme = useContext(ThemeContext)
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

  const [ttl, setTtl] = useUserTransactionTTL()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  const enableExpertMode = () => {
    toggle()
    setShowConfirmation(true)
  }

  const disableExpertMode = () => {
    toggleExpertMode()
    setShowConfirmation(false)
  }

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <ModalContentWrapper>
          <AutoColumn gap="lg">
            <RowBetween style={{ padding: '0 2rem' }}>
              <div />
              <Text fontWeight={500} fontSize={20}>
                {t('areYouSure')}
              </Text>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </RowBetween>
            <Break />
            <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
              <Text fontWeight={500} fontSize={20}>
                {t('expertModeDescription')}
              </Text>
              <Text fontWeight={600} fontSize={20}>
                {t('expertModeWarning')}
              </Text>
              <ButtonError error={true} padding={'12px'} onClick={disableExpertMode}>
                <Text fontSize={20} fontWeight={500} id="confirm-expert-mode">
                  {t('turnOnExpertMode')}
                </Text>
              </ButtonError>
            </AutoColumn>
          </AutoColumn>
        </ModalContentWrapper>
      </Modal>

      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        <StyledMenuIcon />
        {expertMode && (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              👨‍💻
            </span>
          </EmojiWrapper>
        )}
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <AutoColumn gap="md" style={{ padding: '1rem' }}>
            <Text fontWeight={600} fontSize={14}>
              {t('transactionSettings')}
            </Text>
            <TransactionSettings
              rawSlippage={userSlippageTolerance}
              setRawSlippage={setUserslippageTolerance}
              deadline={ttl}
              setDeadline={setTtl}
            />
            <Text fontWeight={600} fontSize={14}>
              {t('interfaceSettings')}
            </Text>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  {t('toggleExpertMode')}
                </TYPE.black>
                <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
              </RowFixed>
              <Toggle
                id="toggle-expert-mode-button"
                isActive={expertMode}
                toggle={() => {
                  if (expertMode) {
                    disableExpertMode()
                  } else {
                    enableExpertMode()
                  }
                }}
              />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  {t('disableMultihops')}
                </TYPE.black>
                <QuestionHelper text="Restricts swaps to direct pairs only." />
              </RowFixed>
              <Toggle
                id="toggle-disable-multihop-button"
                isActive={singleHopOnly}
                toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
              />
            </RowBetween>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
