// One result region with five panels, picked by status.
// type, county, count, and queryUrl all come from the same finished search.
export default function ResultCard({ status, type, county, count, queryUrl, errorCode, onRetry }) {
  if (status === 'loading') {
    return (
      <section aria-labelledby="result-heading">
        <h2 id="result-heading">Checking Texas license records</h2>
        <p>This usually takes a few seconds.</p>
      </section>
    )
  }

  if (status === 'error') {
    const code = errorCode === null ? 'no connection' : `error ${errorCode}`
    return (
      <section aria-labelledby="result-heading">
        <h2 id="result-heading">We could not reach the Texas data service.</h2>
        <p>({code})</p>
        <p>This is a problem on our side, not something you did. Your choices are saved.</p>
        <button type="button" className="border" onClick={onRetry}>
          Try again
        </button>
      </section>
    )
  }

  if (status === 'empty') {
    // Empty is a valid answer (HTTP 200, zero holders), so it reads as information, not a failure.
    return (
      <section aria-labelledby="result-heading">
        <h2 id="result-heading">No matching records found</h2>
        <p>
          TDLR lists no {type} licenses with {county} County as the business county.
        </p>
        <p>Try a nearby county or the other license type.</p>
        <RequestDetails queryUrl={queryUrl} />
      </section>
    )
  }

  if (status === 'success') {
    return (
      <section aria-labelledby="result-heading">
        <h2 id="result-heading">
          {type} in {county} County
        </h2>
        <p className="text-4xl">{count.toLocaleString()}</p>
        <p>people hold this license with {county} County listed as their business county.</p>
        <p>A count is not a job listing.</p>
        <RequestDetails queryUrl={queryUrl} />
      </section>
    )
  }

  return (
    <section aria-labelledby="result-heading">
      <h2 id="result-heading">Your result will appear here</h2>
      <p>Pick a license type and a county, then select Show license count.</p>
    </section>
  )
}

function RequestDetails({ queryUrl }) {
  return (
    <details>
      <summary>See the exact data request</summary>
      {/* Same URL the app fetched, so the number can be checked in a browser tab. */}
      <a href={queryUrl} target="_blank" rel="noreferrer" className="break-all">
        {queryUrl}
      </a>
    </details>
  )
}
