import { useEffect } from 'react'
import { fetchLicenseTypes } from './api/tdlr.js'

export default function App() {
  useEffect(() => {
    // Ignore flag so React StrictMode's double effect run in dev logs only once.
    let ignore = false
    fetchLicenseTypes()
      .then((types) => {
        if (!ignore) console.log('License types:', types)
      })
      .catch((err) => {
        if (!ignore) console.error('License types failed:', err.status, err.message)
      })
    return () => {
      ignore = true
    }
  }, [])

  return <h1 className="text-3xl">Texas Second Chance License Navigator</h1>
}
