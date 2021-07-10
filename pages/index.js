import getAllProducts from '@/lib/get-all-products'
import getPageData from '@/lib/get-page-data'
import ProductGrid from '@/components/product-grid'
import Sidebar from '@/components/sidebar'

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
  const { products } = await getAllProducts({ locale })

  return {
    props: { ...pageData, products }
  }
}

export default IndexPage
