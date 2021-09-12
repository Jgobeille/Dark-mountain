import * as React from 'react'
import { DefaultSeo } from 'next-seo'

import { defaultSeo } from 'next-seo.config'
import Footer from '@/components/footer'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import { useRouter } from 'next/router'
import Modal from '@/components/modal'
import LegalModal from '@/components/legalModal'

import { useSettingsContext } from '@/context/settings'

function Layout({ children, footer, navigation }) {
  const router = useRouter()

  const { designs, checkoutInitialized } = useSettingsContext()

  // const reportWindowHeight = () => {
  //   const heightOutput = window.innerHeight

  //   console.log(heightOutput)

  //   setHeightValue(heightValue)

  //   return heightOutput
  // }

  // const [heightValue, setHeightValue] = React.useState()

  // React.useEffect(() => {
  //   window.addEventListener('resize', reportWindowHeight)
  // }, [])

  // React.useEffect(() => {
  //   reportWindowHeight()
  // }, [])

  const showHeader = router.pathname.includes('products') ? false : true

  return (
    <React.Fragment>
      {showHeader && <Header />}

      <div
        className={`flex flex-row ${
          checkoutInitialized ? '  h-full ' : 'lg:min-h-screen '
        }`}
      >
        <div className="w-full lg:w-2/3">{children}</div>
        <Sidebar designs={designs} />
        <Modal />
        <LegalModal />
      </div>
      <Footer {...footer} />
    </React.Fragment>
  )
}

export default Layout
