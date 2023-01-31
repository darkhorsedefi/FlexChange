import React, { useCallback } from 'react'
import styled from 'styled-components'
import useENS from 'hooks/useENS'
import { useActiveWeb3React } from 'hooks'
import { ExternalLink, TYPE } from 'theme'
import { getExplorerLink } from 'utils'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  background-color: var(--color-background-module);
  color: var(--color-text-primary);
  border-radius: 12px;
  padding: 8px 0;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  transition: height 1s ease;
  will-change: height;
  z-index: 1;
  width: 100%;

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

const ContainerRow = styled.div<{ error: boolean }>`
  border-radius: 12px;
`

const InputContainer = styled.div`
  flex: 1;
  padding: 1rem;
`

const Input = styled.input<{ error?: boolean; disabled: boolean }>`
  font-size: inherit;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  color: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: inherit;
  width: 100%;

  ${({ disabled }) => (disabled ? 'opacity: 0.5' : '')};

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

export default function AddressInputPanel({
  id,
  label,
  disabled = false,
  value,
  onChange,
  placeholder,
}: {
  id?: string
  label?: string | JSX.Element
  disabled?: boolean
  placeholder?: boolean | undefined
  value: string
  onChange: (value: string) => void
}) {
  const { chainId } = useActiveWeb3React()
  const { address, loading, name } = useENS(value)

  const handleInput = useCallback(
    (event) => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      onChange(withoutSpaces)
    },
    [onChange]
  )

  const error = Boolean(value.length > 0 && !loading && !address)

  return (
    <InputPanel id={id}>
      <ContainerRow error={error}>
        <InputContainer>
          <AutoColumn gap="sm">
            <RowBetween>
              <TYPE.black color="var(--color-text-primary)" fontWeight={500} fontSize={14}>
                {label || 'Recipient'}
              </TYPE.black>
              {address && chainId && (
                <ExternalLink href={getExplorerLink(chainId, name ?? address, 'address')} style={{ fontSize: '14px' }}>
                  (View in Explorer)
                </ExternalLink>
              )}
            </RowBetween>
            <Input
              disabled={disabled}
              className="recipient-address-input"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder={placeholder ? 'Wallet Address or ENS name' : '...'}
              error={error}
              pattern="^(0x[a-fA-F0-9]{40})$"
              onChange={disabled ? () => {} : handleInput}
              value={value}
            />
          </AutoColumn>
        </InputContainer>
      </ContainerRow>
    </InputPanel>
  )
}
