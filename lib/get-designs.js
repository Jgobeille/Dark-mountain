import graphcmsClient, { gql } from '@/lib/graphcms-client'

export const getDesignsQuery = gql`
  query Designs {
    designs(first: 10) {
      date
      image {
        url
        width
      }
      title
      description
      altText
    }
  }
`
async function getDesigns() {
  const { designs } = await graphcmsClient.request(getDesignsQuery)

  return {
    designs
  }
}

export default getDesigns
