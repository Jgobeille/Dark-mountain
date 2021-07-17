import { CartProvider } from 'react-use-cart'

import Head from 'next/head'

import '../styles/styles.css'
import 'tailwindcss/tailwind.css'

import { SettingsProvider } from '@/context/settings'
import Layout from '@/components/layout'

function App({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <CartProvider>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </SettingsProvider>
  )
}

export default App
