import commerce from '@/lib/commerce'
/**
 * Fetches the available shipping methods for the current checkout
 * https://commercejs.com/docs/sdk/checkout#get-shipping-methods
 *
 * @param {string} checkoutTokenId
 * @param {string} country
 * @param {string} stateProvince
 */
const fetchShippingOptionsAndSubdivisions = async (
  checkoutToken,
  country,
  stateProvince = null,
  values,
  setValues,
  valuesType,
  countriesList
) => {
  const options = await commerce.checkout.getShippingOptions(checkoutToken, {
    country: country,
    region: stateProvince
  })

  const shippingOption = options[0] || null

  const countryCode = country
  const subdivisions = await commerce.services.localeListSubdivisions(
    countryCode
  )
  if (countriesList && valuesType === 'shipping') {
    setValues({
      ...values,
      shippingCountries: countriesList,
      shippingSubdivisions: subdivisions.subdivisions,
      shippingOptions: options,
      shippingOption: shippingOption
    })
  } else if (valuesType === 'shipping') {
    setValues({
      ...values,
      shippingSubdivisions: subdivisions.subdivisions,
      shippingOptions: options,
      shippingOption: shippingOption
    })
  } else if (valuesType === 'billing') {
    setValues({
      ...values,
      billingSubdivisions: subdivisions.subdivisions,
      billingOptions: options,
      billingOption: shippingOption
    })
  }
}

export default fetchShippingOptionsAndSubdivisions
