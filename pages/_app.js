import { CartProvider } from '@/context/cart.js'

import Head from 'next/head'

import '../styles/styles.css'
import 'tailwindcss/tailwind.css'

import { SettingsProvider } from '@/context/settings'
import Layout from '@/components/layout'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function App({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <CartProvider>
        <Elements stripe={stripePromise}>
          <Layout {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </Elements>
      </CartProvider>
    </SettingsProvider>
  )
}

export default App
