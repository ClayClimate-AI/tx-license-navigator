import { useCallback, useEffect, useRef, useState } from 'react'
import { buildCountUrl, fetchHolderCount, fetchLicenseTypes } from './api/tdlr.js'
import LicensePicker from './components/LicensePicker.jsx'
import ResultCard from './components/ResultCard.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import SourceNote from './components/SourceNote.jsx'
import StatusMessage from './components/StatusMessage.jsx'
import TrustNote from './components/TrustNote.jsx'
import { COUNTIES } from './data/counties.js'

const DEFAULT_TYPE = 'A/C Technician'

export default function App() {
  const [licenseTypes, setLicenseTypes] = useState([])
  const [typesLoading, setTypesLoading] = useState(true)
  const [type, setType] = useState('')
  const [county, setCounty] = useState('')
  const [fieldError, setFieldError] = useState(null)
  const [status, setStatus] = useState('idle')
  // null together with status 'error' means the request never got an answer (no connection).
  const [errorCode, setErrorCode] = useState(null)
  // Snapshot of the search that produced the panel, so the heading stays correct
  // even if the visitor changes a select afterwards.
  const [result, setResult] = useState(null)
  // The last search that was sent, so Try again repeats exactly that search.
  const [lastSearch, setLastSearch] = useState(null)

  const loadTypes = useCallback((isIgnored = () => false) => {
    // Requirement 2.6: the loading state also covers the license type request.
    setTypesLoading(true)
    setStatus('loading')
    fetchLicenseTypes()
      .then((types) => {
        if (isIgnored()) return
        const names = types.map((t) => t.licenseType)
        setLicenseTypes(names)
        // Set the default only after the list arrives, so it always matches a real option.
        setType(names.includes(DEFAULT_TYPE) ? DEFAULT_TYPE : (names[0] ?? ''))
        setErrorCode(null)
        setStatus('idle')
      })
      .catch((err) => {
        if (isIgnored()) return
        setErrorCode(err.status ?? null)
        setStatus('error')
      })
      .finally(() => {
        if (!isIgnored()) setTypesLoading(false)
      })
  }, [])

  useEffect(() => {
    // Ignore flag so React StrictMode's double effect run in dev only applies one result.
    let ignore = false
    loadTypes(() => ignore)
    return () => {
      ignore = true
    }
  }, [loadTypes])

  function handleCountyChange(value) {
    setCounty(value)
    if (value) setFieldError(null)
  }

  async function runSearch(searchType, searchCounty) {
    setLastSearch({ type: searchType, county: searchCounty })
    setResult(null)
    setErrorCode(null)
    setStatus('loading')

    const countyLabel = COUNTIES.find((c) => c.value === searchCounty)?.label ?? searchCounty
    const queryUrl = buildCountUrl(searchType, searchCounty)
    try {
      const count = await fetchHolderCount(searchType, searchCounty)
      setResult({ type: searchType, countyLabel, count, queryUrl })
      // fetchHolderCount returns 0 for both [] and "0", so one check covers both.
      setStatus(count === 0 ? 'empty' : 'success')
    } catch (err) {
      setErrorCode(err.status ?? null)
      setStatus('error')
    }
  }

  function handleSubmit() {
    if (!county) {
      setFieldError('Choose a county.')
      return
    }
    setFieldError(null)
    runSearch(type, county)
  }

  function handleRetry() {
    // If the license type list never loaded, retry that first; otherwise repeat the search.
    if (licenseTypes.length === 0) {
      loadTypes()
    } else if (lastSearch) {
      runSearch(lastSearch.type, lastSearch.county)
    }
  }

  // After a search finishes, move focus to the result heading so keyboard and screen reader
  // users land on the answer.
  const resultHeadingRef = useRef(null)
  useEffect(() => {
    if (status === 'success' || status === 'empty' || status === 'error') {
      resultHeadingRef.current?.focus()
    }
  }, [status])

  // Requirement 2.5: never show an empty, unusable form when the type list failed.
  const typesFailed = !typesLoading && licenseTypes.length === 0

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#1B2733]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-6 md:px-6">
        <h1 className="text-[26px] font-bold leading-tight text-[#14304F]">
          Look up HVAC license demand by county
        </h1>
        <p className="mt-1.5 text-[16px] text-[#2B3A49]">
          See how many people hold an HVAC license in a Texas county. Use it to judge local demand
          before you train or apply.
        </p>
        <TrustNote />
        {!typesFailed && (
          <LicensePicker
            types={licenseTypes}
            type={type}
            county={county}
            onTypeChange={setType}
            onCountyChange={handleCountyChange}
            onSubmit={handleSubmit}
            busy={typesLoading || status === 'loading'}
            fieldError={fieldError}
          />
        )}
        <StatusMessage
          status={status}
          type={result?.type}
          county={result?.countyLabel}
          errorCode={errorCode}
        />
        <ResultCard
          status={status}
          type={result?.type}
          county={result?.countyLabel}
          count={result?.count}
          queryUrl={result?.queryUrl}
          errorCode={errorCode}
          onRetry={handleRetry}
          headingRef={resultHeadingRef}
        />
      </main>
      <SourceNote />
    </div>
  )
}
