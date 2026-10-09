// One result region with five panels, picked by status.
// type, county, count, and queryUrl all come from the same finished search.
// headingRef lets App move focus to the heading after each search.
const focusRing =
  'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#F2B807]'
const headingClass = 'text-[18px] font-bold text-[#1B2733] outline-none'

export default function ResultCard({
  status,
  type,
  county,
  count,
  queryUrl,
  errorCode,
  onRetry,
  headingRef,
}) {
  if (status === 'loading') {
    return (
      <section aria-labelledby="result-heading" className="mt-3 rounded-md border border-[#C7D0DB] bg-white p-5">
        <h2 id="result-heading" className={headingClass}>
          Checking Texas license records
        </h2>
        <p className="text-[15px] text-[#4A5A6A]">This usually takes a few seconds.</p>
      </section>
    )
  }

  if (status === 'error') {
    const code = errorCode === null ? 'no connection' : `error ${errorCode}`
    return (
      <section
        aria-labelledby="result-heading"
        className="mt-3 rounded-md border-2 border-[#A3243B] bg-[#FDF2F4] p-5"
      >
        <h2 id="result-heading" ref={headingRef} tabIndex={-1} className={`${headingClass} text-[#7A1B2C]`}>
          We could not reach the Texas data service.
        </h2>
        <p className="mt-1 font-mono text-[14px] text-[#4A5A6A]">({code})</p>
        <p className="mt-1 text-[15px] text-[#4A5A6A]">
          This is a problem on our side, not something you did. Your choices are saved.
        </p>
        <button
          type="button"
          className={`mt-3 rounded bg-[#A3243B] px-4 py-2 text-[15px] font-bold text-white hover:brightness-110 ${focusRing}`}
          onClick={onRetry}
        >
          Try again
        </button>
      </section>
    )
  }

  if (status === 'empty') {
    // Empty is a valid answer (HTTP 200, zero holders), so it reads as information, not a failure.
    return (
      <section
        aria-labelledby="result-heading"
        className="mt-3 rounded-md border border-[#E3C46B] bg-[#FFFBEB] p-5"
      >
        <h2 id="result-heading" ref={headingRef} tabIndex={-1} className={headingClass}>
          No matching records found
        </h2>
        <p className="mt-1 text-[15px] text-[#4A5A6A]">
          TDLR lists no {type} licenses with {county} County as the business county.
        </p>
        <p className="text-[15px] text-[#4A5A6A]">Try a nearby county or the other license type.</p>
        <RequestDetails queryUrl={queryUrl} />
      </section>
    )
  }

  if (status === 'success') {
    return (
      <section
        aria-labelledby="result-heading"
        className="mt-3 rounded-md border border-l-[6px] border-[#1F5C99] bg-white p-5 shadow-sm"
      >
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#1F5C99]">Result</p>
        <h2 id="result-heading" ref={headingRef} tabIndex={-1} className={`mt-1 ${headingClass}`}>
          {type} in {county} County
        </h2>
        <p className="mt-1 text-[44px] font-extrabold leading-none tabular-nums text-[#14304F]">
          {count.toLocaleString()}
        </p>
        <p className="mt-2 text-[15px] text-[#4A5A6A]">
          people hold this license with {county} County listed as their business county.
        </p>
        <p className="mt-3 rounded bg-[#F3F5F8] p-3 text-[15px]">A count is not a job listing.</p>
        <RequestDetails queryUrl={queryUrl} />
      </section>
    )
  }

  return (
    <section
      aria-labelledby="result-heading"
      className="mt-3 rounded-md border-2 border-dashed border-[#C7D0DB] bg-[#F9FAFB] p-5"
    >
      <h2 id="result-heading" className={headingClass}>
        Your result will appear here
      </h2>
      <p className="mt-0.5 text-[15px] text-[#4A5A6A]">
        Pick a license type and a county, then select Show license count.
      </p>
    </section>
  )
}

function RequestDetails({ queryUrl }) {
  return (
    <details className="mt-3 text-[14px] text-[#4A5A6A]">
      <summary className={`cursor-pointer font-semibold text-[#1A5FB4] underline ${focusRing}`}>
        See the exact data request
      </summary>
      {/* Same URL the app fetched, so the number can be checked in a browser tab. */}
      <a
        href={queryUrl}
        target="_blank"
        rel="noreferrer"
        className={`mt-2 block break-all text-[13px] text-[#1A5FB4] underline ${focusRing}`}
      >
        {queryUrl}
      </a>
    </details>
  )
}
