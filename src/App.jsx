import { useEffect, useState } from 'react'
import { buildCountUrl, fetchHolderCount, fetchLicenseTypes } from './api/tdlr.js'
import LicensePicker from './components/LicensePicker.jsx'
import ResultCard from './components/ResultCard.jsx'
import { COUNTIES } from './data/counties.js'

const DEFAULT_TYPE = 'A/C Technician'

export default function App() {
  const [licenseTypes, setLicenseTypes] = useState([])
  const [typesLoading, setTypesLoading] = useState(true)
  const [type, setType] = useState('')
  const [county, setCounty] = useState('')
  const [fieldError, setFieldError] = useState(null)
  // Temporary flags for task 4. Task 5 replaces them with the single status value.
  const [checking, setChecking] = useState(false)
  const [countError, setCountError] = useState(null)
  // Snapshot of the search that produced the number, so the heading stays correct
  // even if the visitor changes a select afterwards.
  const [result, setResult] = useState(null)

  useEffect(() => {
    // Ignore flag so React StrictMode's double effect run in dev only applies one result.
    let ignore = false
    fetchLicenseTypes()
      .then((types) => {
        if (ignore) return
        const names = types.map((t) => t.licenseType)
        setLicenseTypes(names)
        // Set the default only after the list arrives, so it always matches a real option.
        setType(names.includes(DEFAULT_TYPE) ? DEFAULT_TYPE : (names[0] ?? ''))
      })
      .catch((err) => {
        // The full error state for this arrives in task 5.
        if (!ignore) console.error('License types failed:', err.status, err.message)
      })
      .finally(() => {
        if (!ignore) setTypesLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  function handleCountyChange(value) {
    setCounty(value)
    if (value) setFieldError(null)
  }

  async function handleSubmit() {
    if (!county) {
      setFieldError('Choose a county.')
      return
    }
    setFieldError(null)
    setCountError(null)
    setResult(null)
    setChecking(true)

    const countyLabel = COUNTIES.find((c) => c.value === county)?.label ?? county
    const queryUrl = buildCountUrl(type, county)
    try {
      const count = await fetchHolderCount(type, county)
      setResult({ type, countyLabel, count, queryUrl })
    } catch (err) {
      setCountError(err.status ?? 'no connection')
    } finally {
      setChecking(false)
    }
  }

  return (
    <main>
      <h1 className="text-3xl">Texas Second Chance License Navigator</h1>
      <LicensePicker
        types={licenseTypes}
        type={type}
        county={county}
        onTypeChange={setType}
        onCountyChange={handleCountyChange}
        onSubmit={handleSubmit}
        busy={typesLoading || checking}
        fieldError={fieldError}
      />
      {checking && <p>Checking…</p>}
      {countError !== null && <p>We could not reach the Texas data service. (error {countError})</p>}
      {result && (
        <ResultCard
          type={result.type}
          county={result.countyLabel}
          count={result.count}
          queryUrl={result.queryUrl}
        />
      )}
    </main>
  )
}
