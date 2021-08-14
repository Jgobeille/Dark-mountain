import { CartProvider } from '@/context/cart.js'

import Head from 'next/head'

import '../styles/styles.css'
import 'tailwindcss/tailwind.css'

import { SettingsProvider } from '@/context/settings'
import Layout from '@/components/layout'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  'pk_test_51JOJZGFdf3S2gyTz8a5sfu4oa9olKpGX5NAUh0Irx7FYO4KDYnU4XeTzfHq7ydhft3VpZKAFOblKCn3w2naLUkga00lNff56Pa'
)

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
