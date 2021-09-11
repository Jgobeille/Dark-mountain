import getPageData from '@/lib/get-page-data'
import getDesigns from '@/lib/get-designs'
import ProductGrid from '@/components/product-grid'

import commerce from '@/lib/commerce'

import CheckoutForm from '@/components/checkout-container'
import { useSettingsContext } from '@/context/settings'

import Logo from '../public/DMC-main-logo.png'
import Meta from '@/components/seo-meta'
function IndexPage({ products, designs }) {
  const { setDesigns } = useSettingsContext()

  setDesigns(designs)
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

export async function getStaticProps({ locale }) {
  const pageData = await getPageData({ locale })

  const { data: products } = await commerce.products.list()
  const { designs } = await getDesigns()

  return {
    props: { ...pageData, products, designs }
  }
}

export default IndexPage
