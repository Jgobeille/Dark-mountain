// import getAllProducts from '@/lib/get-all-products'
import getPageData from '@/lib/get-page-data'
import ProductGrid from '@/components/product-grid'
import Sidebar from '@/components/sidebar'

import commerce from '@/lib/commerce'
import CheckoutForm from '@/components/checkout-container'
function IndexPage({ products }) {
  return (
    <div className="flex flex-col">
      <ProductGrid products={products} />
      <CheckoutForm />
      <Sidebar />
    </div>
  )
}

export async function getStaticProps({ locale }) {
  const pageData = await getPageData({ locale })

  const { data: products } = await commerce.products.list()

  return {
    props: { ...pageData, products }
  }
}

export default IndexPage
