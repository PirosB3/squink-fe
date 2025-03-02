import React from 'react'
import ReactDOM from 'react-dom'
import Web3Provider from 'web3-react'
import connect from 'lotion-connect';

import ThemeProvider, { GlobalStyle } from './theme'
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage'
import ApplicationContextProvider, { Updater as ApplicationContextUpdater } from './contexts/Application'
import TransactionContextProvider, { Updater as TransactionContextUpdater } from './contexts/Transactions'
import TokensContextProvider from './contexts/Tokens'
import BalancesContextProvider from './contexts/Balances'
import AllowancesContextProvider from './contexts/Allowances'
import AllBalancesContextProvider from './contexts/AllBalances'

import App from './pages/App'
import NetworkOnlyConnector from './NetworkOnlyConnector'
import InjectedConnector from './InjectedConnector'

import './i18n'

const Network = new NetworkOnlyConnector({ providerURL: process.env.REACT_APP_NETWORK_URL || '' })
const Injected = new InjectedConnector({ supportedNetworks: [Number(process.env.REACT_APP_NETWORK_ID || '1')] })
const connectors = { Injected, Network }

function ContextProviders({ children }) {
  return (
    <LocalStorageContextProvider>
      <ApplicationContextProvider>
        <TransactionContextProvider>
          <TokensContextProvider>
            <BalancesContextProvider>
              <AllBalancesContextProvider>
                <AllowancesContextProvider>{children}</AllowancesContextProvider>
              </AllBalancesContextProvider>
            </BalancesContextProvider>
          </TokensContextProvider>
        </TransactionContextProvider>
      </ApplicationContextProvider>
    </LocalStorageContextProvider>
  )
}

function Updaters() {
  return (
    <>
      <LocalStorageContextUpdater />
      <ApplicationContextUpdater />
      <TransactionContextUpdater />
    </>
  )
}

ReactDOM.render(
  <Web3Provider connectors={connectors} libraryName="ethers.js">
    <ContextProviders>
      <Updaters />
      <ThemeProvider>
        <>
          <GlobalStyle />
          <App />
        </>
      </ThemeProvider>
    </ContextProviders>
  </Web3Provider>,
  document.getElementById('root')
)

const start = async () => {
  const { state, send } = await connect(null, {
    genesis: require('./genesis.json'),
    nodes: ['ws://localhost:26657'],
  })
  console.log(await state)
  console.log(await send({ foo: 'bar' }))
}
start();