import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Copy, ExternalLink, Power } from 'react-feather'
import { useETHBalances } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { shortenAddress } from 'utils'
import Identicon from 'components/Identicon'
import IconButton from 'components/IconButton'
import Loader from 'components/Loader'
import networks from 'networks.json'

const StyledMenuHeader = styled.div``

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledRowItem = styled.div`
  display: flex;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 8px;
  }
`

const StyledAddress = styled.span`
  font-weight: 500;
`

const StyledAccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledBalanceTitle = styled.div`
  color: var(--color-text-secondary);
  padding: 20px 0 8px;
`

const StyledBalance = styled.div`
  font-size: 36px;
  line-height: 36px;
  font-weight: 400;
`

const StyledSeparator = styled.div`
  width: 100%;
  height: 1px;
  margin: 16px 0;
  background-color: var(--color-background-interactive);
`

export default function MenuHeader() {
  const { t } = useTranslation()
  const { account, chainId, deactivate } = useActiveWeb3React()
  const baseCoinBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  // @ts-ignore
  const { baseCurrency, explorer } = networks[chainId] || {}

  const [isCopied, setCopied] = useCopyClipboard()

  const onCopy = useCallback(() => setCopied(account || ''), [account, setCopied])

  return (
    <StyledMenuHeader>
      {!account ? (
        <>
          {/* @todo solve the problem with initial connection (user doesn't have to connect to see UI) */}
          <button>Connect</button>
        </>
      ) : (
        <>
          <StyledRow>
            <StyledRowItem>
              <Identicon />
              <StyledAddress>{shortenAddress(account, 3)}</StyledAddress>
            </StyledRowItem>

            <StyledRowItem>
              <IconButton onClick={onCopy} Icon={Copy}>
                {isCopied ? t('copied') : t('copy')}
              </IconButton>
              <IconButton href={`${explorer}/address/${account}`} target="_blank" Icon={ExternalLink}>
                {t('explorer')}
              </IconButton>
              <IconButton onClick={deactivate} Icon={Power}>
                {t('disconnect')}
              </IconButton>
            </StyledRowItem>
          </StyledRow>

          {account && (
            <StyledAccountInfo>
              <StyledBalanceTitle>{t('balance')}</StyledBalanceTitle>
              {baseCoinBalance ? (
                <StyledBalance>
                  {baseCoinBalance?.toSignificant(5)} {baseCurrency?.symbol}
                  {/* @todo: add fiat balance */}
                </StyledBalance>
              ) : (
                <Loader />
              )}
              <StyledSeparator />
            </StyledAccountInfo>
          )}
        </>
      )}
    </StyledMenuHeader>
  )
}
