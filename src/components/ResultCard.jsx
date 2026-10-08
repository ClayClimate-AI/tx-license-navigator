// Success panel only for now. Empty, error, and idle panels arrive in task 5.
export default function ResultCard({ type, county, count, queryUrl }) {
  return (
    <section aria-labelledby="result-heading">
      <h2 id="result-heading">
        {type} in {county} County
      </h2>
      <p className="text-4xl">{count.toLocaleString()}</p>
      <p>people hold this license with {county} County listed as their business county.</p>
      <p>A count is not a job listing.</p>
      <details>
        <summary>See the exact data request</summary>
        {/* Same URL the app fetched, so the number can be checked in a browser tab. */}
        <a href={queryUrl} target="_blank" rel="noreferrer" className="break-all">
          {queryUrl}
        </a>
      </details>
    </section>
  )
}
