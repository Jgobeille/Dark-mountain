// import getAllProducts from '@/lib/get-all-products'
import getPageData from '@/lib/get-page-data'
import ProductGrid from '@/components/product-grid'
import Sidebar from '@/components/sidebar'

import commerce from '@/lib/commerce'
function IndexPage({ products }) {
  return (
    <div className="flex flex-row">
      <ProductGrid products={products} />
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
