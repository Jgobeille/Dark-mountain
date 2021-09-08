import Head from 'next/head'
import ProductCard from './product-card'
const Meta = (props) => {
  console.log(props)
  return (
    <Head>
      <title></title>
      <meta name="description" content={props.desc} />
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content="" />
      <meta
        name="og:description"
        property="og:description"
        content={props.desc}
      />
      <meta property="og:site_name" content="Dark Mountain Cult" />
      <meta property="og:url" content={props.canonical} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.desc} />
      <meta name="twitter:site" content="Dark Mountain Cult" />
      <meta name="twitter:creator" content="Dark Mountain Cult" />
      <link rel="icon" type="image/png" href={props.src} />
      <link rel="apple-touch-icon" href={props.src} />
      <link rel="stylesheet" href="" />
      <meta property="og:image" content={props.src} />
      <meta name="twitter:image" content={props.src} />
      {props.canonical && <link rel="canonical" href={`${props.canonical}`} />}
    </Head>
  )
}
export default Meta
