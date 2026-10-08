import { useEffect, useState } from 'react'
import { fetchLicenseTypes } from './api/tdlr.js'
import LicensePicker from './components/LicensePicker.jsx'

const DEFAULT_TYPE = 'A/C Technician'

export default function App() {
  const [licenseTypes, setLicenseTypes] = useState([])
  const [typesLoading, setTypesLoading] = useState(true)
  const [type, setType] = useState('')
  const [county, setCounty] = useState('')
  const [fieldError, setFieldError] = useState(null)

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

  function handleSubmit() {
    if (!county) {
      setFieldError('Choose a county.')
      return
    }
    setFieldError(null)
    // The count fetch is added in task 4.
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
        busy={typesLoading}
        fieldError={fieldError}
      />
    </main>
  )
}
