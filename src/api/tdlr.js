// All network code for the TDLR All Licenses dataset lives here.
// Counts only: queries use license_type, business_county, and count(*) and nothing else.

export const DATASET_URL = 'https://data.texas.gov/resource/7358-krk7.json'
export const HVAC_TYPES = ['A/C Technician', 'A/C Contractor']

// SoQL string literal: single quotes, with any inner single quote doubled.
function quote(value) {
  return `'${String(value).replace(/'/g, "''")}'`
}

export function buildTypesUrl() {
  const params = new URLSearchParams({
    $select: 'license_type, count(*) AS holders',
    $where: 'license_type IS NOT NULL',
    $group: 'license_type',
    $order: 'holders DESC',
    $limit: '50',
  })
  return `${DATASET_URL}?${params}`
}

export async function fetchLicenseTypes() {
  let response
  try {
    response = await fetch(buildTypesUrl())
  } catch (err) {
    // Network failure: no HTTP status exists.
    throw Object.assign(new Error('Could not reach the TDLR API: ' + err.message), {
      status: null,
    })
  }

  if (!response.ok) {
    throw Object.assign(new Error('TDLR API answered HTTP ' + response.status), {
      status: response.status,
    })
  }

  const rows = await response.json()
  // Socrata returns counts as strings ("60809"), so convert before use.
  return rows.map((row) => ({
    licenseType: row.license_type,
    holders: Number(row.holders),
  }))
}

// business_county is stored in ALL CAPS, so the county is upper cased here no matter
// what the caller passes.
export function buildCountUrl(type, county) {
  const params = new URLSearchParams({
    $select: 'count(*) AS holders',
    $where: `license_type=${quote(type)} AND business_county=${quote(String(county).toUpperCase())}`,
  })
  return `${DATASET_URL}?${params}`
}

// Returns a number. 0 means no matching records (the empty state, not an error).
export async function fetchHolderCount(type, county) {
  let response
  try {
    response = await fetch(buildCountUrl(type, county))
  } catch (err) {
    // Network failure: no HTTP status exists.
    throw Object.assign(new Error('Could not reach the TDLR API: ' + err.message), {
      status: null,
    })
  }

  if (!response.ok) {
    throw Object.assign(new Error('TDLR API answered HTTP ' + response.status), {
      status: response.status,
    })
  }

  const rows = await response.json()
  if (rows.length === 0) return 0

  // Socrata returns the count as a string ("12095"), so convert before use.
  const holders = Number(rows[0].holders)
  if (Number.isNaN(holders)) {
    throw Object.assign(new Error('TDLR API returned a count that is not a number'), {
      status: null,
    })
  }
  return holders
}
