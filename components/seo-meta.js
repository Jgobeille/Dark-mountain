import Head from 'next/head'
import ProductCard from './product-card'
import Logo from '../public/DMC-main-logo.png'
const Meta = (props) => {
  console.log(props)
  return (
    <Head>
      <title></title>
      <meta name="description" content={props.desc} />
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={props.title} />
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
      <meta name="facebook:card" content="summary" />
      <meta name="facebook:title" content={props.title} />
      <meta name="facebook:description" content={props.desc} />
      <meta name="facebook:site" content="Dark Mountain Cult" />
      <meta name="facebook:creator" content="Dark Mountain Cult" />
      <link rel="icon" type="image/png" href={`${props.image}`} />

      {props.image ? (
        <link rel="apple-touch-icon" content={`${props.image}`} />
      ) : (
        <link rel="apple-touch-icon" content={Logo} />
      )}
      {props.image ? (
        <meta property="og:image" content={`${props.image}`} />
      ) : (
        <meta property="og:image" content={Logo} />
      )}
      {props.image && <meta name="twitter:image" content={`${props.image}`} />}
      {props.image && <meta name="facebook:image" content={`${props.image}`} />}
      {props.canonical && <link rel="canonical" href={`${props.canonical}`} />}
    </Head>
  )
}
export default Meta
