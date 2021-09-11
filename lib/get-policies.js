import graphcmsClient, { gql } from '@/lib/graphcms-client'

export const getPoliciesQuery = gql`
  query getPolicies {
    privacyPolicy(where: { id: "cktfhy1hc8tjg0b71c0wit4ea" }) {
      title
      policyDescription
    }
    returnsPolicy(where: { id: "cktfikcq05usx0c30ywso8uod" }) {
      title
      policyDescription
    }
    termsOfService(where: { id: "cktfiixso8unq0b7143nf2ais" }) {
      title
      policyDescription
    }
  }
`
async function getPolicies() {
  const policies = await graphcmsClient.request(getPoliciesQuery)

  return {
    policies
  }
}

export default getPolicies
