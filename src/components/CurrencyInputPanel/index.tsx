import { Currency, Pair } from 'sdk'
import React, { useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from 'state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { TYPE } from 'theme'
import { ButtonGray } from '../Button'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from 'assets/images/dropdown.svg'

import { useActiveWeb3React } from 'hooks'
import { useTranslation } from 'react-i18next'
import useTheme from 'hooks/useTheme'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 16px;
`

const CurrencySelect = styled(ButtonGray)<{ isCurrencySelected?: boolean }>`
  align-items: center;
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.5)};
  cursor: pointer;
  outline: none;
  user-select: none;
  border: none;
  border-radius: 16px;
  font-size: 20px;
  font-weight: 500;
  height: unset;
  width: initial;
  padding: 4px 8px 4px 4px;
  justify-content: space-between;
  margin-left: 12px;

  ${({ isCurrencySelected }) =>
    isCurrencySelected
      ? css`
          background-color: var(--color-background-interactive);
          color: var(--color-text-primary);

          &:focus,
          &:hover {
            background-color: var(--color-deprecated_bg3);
            opacity: 1;
          }
        `
      : css`
          background-color: var(--color-brand);
          color: var(--color-f-brightest);

          &:focus,
          &:hover {
            background-color: var(--color-brand);
            opacity: 1;
          }
        `}
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  line-height: 1rem;
  min-height: 20px;
  padding: 0 16px;

  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ theme }) => theme.text1};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  z-index: 1;
  position: relative;
  background-color: var(--color-background-module);
  border-radius: 12px;
  padding: 8px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  transition: height 1s ease;
  will-change: height;

  &:before {
    box-sizing: border-box;
    background-size: 100%;
    border-radius: inherit;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    pointer-events: none;
    content: '';
    border: 1px solid var(--color-background-module);
  }

  &:hover:before {
    border-color: var(--color-state-overlay-hover);
  }

  &:focus-within:before {
    border-color: var(--color-state-overlay-pressed);
  }
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 12px;
`

const StyledTokenName = styled.span`
  margin: 0 0.25rem;
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: VoidFunction
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  customBalanceText?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  customBalanceText,
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const selectedCurrencySymbol =
    currency && currency.symbol && currency.symbol.length > 20
      ? currency.symbol.slice(0, 4) + '...' + currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
      : currency?.symbol

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput className="token-amount-input" value={value} onUserInput={onUserInput} />
            </>
          )}
          <CurrencySelect
            id="open-currency-select-button"
            isCurrencySelected={!!selectedCurrencySymbol}
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'24px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName className="token-symbol-container">
                  {selectedCurrencySymbol || t('selectToken')}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && <StyledDropDown />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
        {!hideInput && (
          <LabelRow>
            <RowBetween jc="flex-end">
              {account && (
                <TYPE.body
                  onClick={onMax}
                  color={theme.text2}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(6)
                    : ''}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
        />
      )}
    </InputPanel>
  )
}
