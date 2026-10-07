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
