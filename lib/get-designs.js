import graphcmsClient, { gql } from '@/lib/graphcms-client'

export const getDesignsQuery = gql`
  query getDesigns {
    designs(last: 10) {
      altText
      description
      image {
        url
        width
      }
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
