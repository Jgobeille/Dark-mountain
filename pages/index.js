import getPageData from '@/lib/get-page-data'
import getDesigns from '@/lib/get-designs'
import ProductGrid from '@/components/product-grid'

import commerce from '@/lib/commerce'

import CheckoutForm from '@/components/checkout-container'
import { useSettingsContext } from '@/context/settings'
function IndexPage({ products, designs }) {
  const { setDesigns } = useSettingsContext()

  setDesigns(designs)
  return (
    <div className="flex flex-col">
      <ProductGrid products={products} />
      <CheckoutForm />
    </div>
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
