import * as React from 'react'
import { DefaultSeo } from 'next-seo'

import { defaultSeo } from 'next-seo.config'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { useRouter } from 'next/router'

function Layout({ children, footer, navigation }) {
  const router = useRouter()

  console.log(router.pathname.includes('products'))
  const showHeader = router.pathname.includes('products') ? false : true
  return (
    <React.Fragment>
      <DefaultSeo {...defaultSeo} />
      {showHeader && <Header />}
      <div className="max-w-full">{children}</div>
      {/* <Footer {...footer} /> */}
    </React.Fragment>
  )
}

export default Layout
