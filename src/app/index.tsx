import React, { Suspense, useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Route, Switch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { AppState } from 'state'
import { useAppState } from 'state/application/hooks'
import { retrieveDomainData } from 'state/application/actions'
import { fetchDomainData } from 'utils/app'
import { useStorageContract } from 'hooks/useContract'
import { SUPPORTED_CHAIN_IDS } from '../connectors'
import Loader from 'components/Loader'
import Panel from 'pages/Panel'
import Connection from 'pages/Connection'
import AddLiquidity from 'pages/AddLiquidity'
import Header from 'components/Header'
import Popups from 'components/Popups'
import GreetingScreen from 'components/GreetingScreen'
import Web3ReactManager from 'components/Web3ReactManager'
import DarkModeQueryParamReader from 'theme/DarkModeQueryParamReader'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from 'pages/AddLiquidity/redirects'
import Pool from 'pages/Pool'
import Pools from 'pages/Pools'
import PoolFinder from 'pages/PoolFinder'
import RemoveLiquidity from 'pages/RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from 'pages/RemoveLiquidity/redirects'
import Swap from 'pages/Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly } from 'pages/Swap/redirects'

const LoaderWrapper = styled.div`
  position: absolute;
  z-index: 4;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg1);
`

const AppWrapper = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div<{ padding?: string }>`
  width: 100%;
  min-height: 100vh;
  padding: ${({ padding }) => padding || '136px 8px 0'};
  overflow-x: hidden;
  z-index: 1;
`

export default function App() {
  const dispatch = useDispatch()
  const { active, chainId, library } = useWeb3React()
  const storage = useStorageContract()
  const [domainData, setDomainData] = useState<any>(null)
  const { admin, factory, router, projectName, pairHash } = useAppState()
  const [domainDataTrigger, setDomainDataTrigger] = useState<boolean>(false)

  useEffect(() => {
    setDomainDataTrigger((state) => !state)
  }, [chainId])

  const [isAvailableNetwork, setIsAvailableNetwork] = useState(true)
  const [greetingScreenIsActive, setGreetingScreenIsActive] = useState(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setGreetingScreenIsActive(!domainData || !domainData?.admin)

    // Set favicon
    const faviconUrl = localStorage.getItem('faviconUrl')

    if (domainData?.favicon && domainData.favicon !== faviconUrl) {
      localStorage.setItem('faviconUrl', domainData.favicon)
      window.location.reload()
    } else if (!loading && !domainData?.favicon && faviconUrl) {
      localStorage.removeItem('faviconUrl')
      window.location.reload()
    }
  }, [domainData, loading])

  useEffect(() => {
    if (chainId) {
      setIsAvailableNetwork(Boolean(SUPPORTED_CHAIN_IDS.includes(Number(chainId))))
    }
    // Set domainDataTrigger as a dependency so we can recheck network on some event (ex. Contract deployment)
  }, [chainId, domainDataTrigger])

  useEffect(() => {
    if (!storage) return

    try {
      const start = async () => {
        const data = await fetchDomainData(chainId, library, storage)

        if (data) {
          dispatch(retrieveDomainData(data))
          setDomainData(data)
        }

        setLoading(false)
      }

      if (!pairHash) start()
    } catch (error) {
      console.error(error)
    }
  }, [chainId, library, storage, dispatch, pairHash])

  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    setAppIsReady(Boolean(active && admin && factory && router))
  }, [chainId, active, admin, factory, router])

  const appManagement = useSelector<AppState, AppState['application']['appManagement']>(
    (state) => state.application.appManagement
  )

  return (
    <Suspense fallback={null}>
      <HelmetProvider>
        <Helmet>
          <title>{projectName || document.title}</title>
        </Helmet>

        <Route component={DarkModeQueryParamReader} />
        <Web3ReactManager>
          <Popups />

          {loading ? (
            <LoaderWrapper>
              <Loader size="2.8rem" />
            </LoaderWrapper>
          ) : appIsReady && isAvailableNetwork ? (
            <>
              {appManagement ? (
                <Panel setDomainDataTrigger={setDomainDataTrigger} />
              ) : (
                <AppWrapper>
                  {/* addition tag for the flex layout */}
                  <div>
                    <HeaderWrapper>
                      <Header />
                    </HeaderWrapper>

                    <BodyWrapper>
                      <Switch>
                        <Route exact strict path="/swap" component={Swap} />
                        <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
                        <Route exact strict path="/find" component={PoolFinder} />
                        <Route exact strict path="/pool" component={Pool} />
                        <Route exact strict path="/pools" component={Pools} />
                        <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                        <Route exact path="/add" component={AddLiquidity} />
                        <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                        <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                        <Route exact path="/create" component={AddLiquidity} />
                        <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                        <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                        <Route
                          exact
                          strict
                          path="/remove/:tokens"
                          component={RedirectOldRemoveLiquidityPathStructure}
                        />
                        <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                        <Route component={RedirectPathToSwapOnly} />
                      </Switch>
                    </BodyWrapper>
                  </div>
                </AppWrapper>
              )}
            </>
          ) : (
            <>
              {greetingScreenIsActive ? (
                <GreetingScreen setGreetingScreenIsActive={setGreetingScreenIsActive} setDomainData={setDomainData} />
              ) : (
                <Connection
                  setDomainDataTrigger={setDomainDataTrigger}
                  domainData={domainData}
                  isAvailableNetwork={isAvailableNetwork}
                />
              )}
            </>
          )}
        </Web3ReactManager>
      </HelmetProvider>
    </Suspense>
  )
}
