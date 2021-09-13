import getDesigns from '@/lib/get-designs'
import getPolicies from '@/lib/get-policies'
import ProductGrid from '@/components/product-grid'

import commerce from '@/lib/commerce'

import CheckoutForm from '@/components/checkout-container'
import { useSettingsContext } from '@/context/settings'

import Logo from '../public/DMC-main-logo.png'
import Meta from '@/components/seo-meta'
import Footer from '@/components/footer'
import { useEffect } from 'react'
function IndexPage({ products, designs, policies }) {
  const { setDesigns, setPolicies } = useSettingsContext()

  useEffect(() => {
    const policiesToArray = Object.values(policies)
    setPolicies(policiesToArray)
    setDesigns(designs)
  }, [setPolicies, setDesigns])

  return (
    <>
      <Meta
        title="Dark Mountain Cult"
        desc="I sell custom prints of your favorite tv shows and video games!"
        canonical="https://dark-mountain.vercel.app"
        css="styles/styles.css"
        image={Logo}
      />
      <ProductGrid products={products} />
      <CheckoutForm />
    </>
  )
}

export async function getStaticProps() {
  const { data: products } = await commerce.products.list()
  const { designs } = await getDesigns()
  const { policies } = await getPolicies()

  return {
    props: { products, designs, policies }
  }
}

export default IndexPage
