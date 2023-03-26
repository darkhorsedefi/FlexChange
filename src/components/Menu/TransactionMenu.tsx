import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { ChevronLeft } from 'react-feather'
import { LinkStyledButton, TYPE } from 'theme'
import { useActiveWeb3React } from 'hooks'
import { useAllTransactions } from '../../state/transactions/hooks'
import { clearAllTransactions } from '../../state/transactions/actions'
import Transaction from 'components/Transaction'
import { AutoRow } from 'components/Row'
import MenuFlyout from 'components/MenuFlyout'
import { NetworkContextName } from '../../constants'
import { isTransactionRecent } from 'state/transactions/hooks'
import { StyledMenuHeader, ReturnButton } from './styled'

const Divider = styled.div`
  border-bottom: 1px solid var(--color-background-outline);
`

const StyledTransactionsWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 0.3rem;
  flex-grow: 1;
  overflow: auto;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  h5 {
    margin: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.text3};
  }
`

const TransactionListWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
`

const StyledNoTransactionWrapper = styled.div`
  text-align: center;
  margin-top: 24px;
  font-weight: 400;
  font-size: 14px;
  padding-left: 12px;
  padding-right: 12px;
  color: var(--color-text-secondary);
`

const renderTransactions = (transactions: string[]) => (
  <TransactionListWrapper>
    {transactions.map((hash) => (
      <Transaction key={hash} hash={hash} />
    ))}
  </TransactionListWrapper>
)

export default function TransactionMenu({ close }: { close: VoidFunction }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { chainId } = useActiveWeb3React()
  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)
  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)

    return txs.filter(isTransactionRecent).sort((a, b) => b.addedTime - a.addedTime)
  }, [allTransactions])

  const pendingTransactions = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmedTransactions = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  const hasAnyTransactions = !!pendingTransactions.length || !!confirmedTransactions.length

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <MenuFlyout>
      <StyledMenuHeader>
        <ReturnButton onClick={close}>
          <ChevronLeft size={22} color="var(--color-text-secondary)" />
        </ReturnButton>
        {t('transactions')}
      </StyledMenuHeader>
      <Divider />
      {!contextNetwork.active && !active ? null : hasAnyTransactions ? (
        <StyledTransactionsWrapper>
          <AutoRow mb="1rem" style={{ justifyContent: 'space-between' }}>
            <TYPE.body>{t('recentTransactions')}</TYPE.body>
            <LinkStyledButton onClick={clearAllTransactionsCallback}>({t('clearAll')})</LinkStyledButton>
          </AutoRow>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </StyledTransactionsWrapper>
      ) : (
        <StyledTransactionsWrapper>
          <StyledNoTransactionWrapper>
            <TYPE.body color="var(--color-background-outline)">{t('yourTransactionsAppearHere')}</TYPE.body>
          </StyledNoTransactionWrapper>
        </StyledTransactionsWrapper>
      )}
    </MenuFlyout>
  )
}
