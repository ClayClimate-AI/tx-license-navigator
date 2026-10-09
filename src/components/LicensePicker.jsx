import { HVAC_TYPES } from '../api/tdlr.js'
import { COUNTIES } from '../data/counties.js'

const focusRing =
  'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#F2B807]'
// mt-auto pins each select to the bottom of its column so both line up when a hint wraps.
const selectClass = `mt-auto w-full rounded border-2 bg-white px-3 py-2.5 text-[16px] ${focusRing}`

export default function LicensePicker({
  types,
  type,
  county,
  onTypeChange,
  onCountyChange,
  onSubmit,
  busy,
  fieldError,
}) {
  // Exact string match, so "A/C CE Provider" never lands in the HVAC group.
  const hvac = HVAC_TYPES.filter((t) => types.includes(t))
  const others = types.filter((t) => !HVAC_TYPES.includes(t))

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-5 rounded-md border border-[#C7D0DB] bg-white p-4 md:p-5"
    >
      <fieldset>
        <legend className="mb-3 text-[17px] font-bold">Choose a license and a county</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="license-type" className="block text-[15px] font-bold">
              License type
            </label>
            <p id="license-type-hint" className="mb-1.5 text-[14px] text-[#4A5A6A]">
              Technicians work for a company. Contractors run the business.
            </p>
            <select
              id="license-type"
              className={`${selectClass} border-[#5F6F82]`}
              aria-describedby="license-type-hint"
              value={type}
              onChange={(e) => onTypeChange(e.target.value)}
              disabled={busy}
            >
              {busy ? (
                <option value="">Loading license types…</option>
              ) : (
                <>
                  <optgroup label="HVAC">
                    {hvac.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All other license types">
                    {others.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="county" className="block text-[15px] font-bold">
              County
            </label>
            <p id="county-hint" className="mb-1.5 text-[14px] text-[#4A5A6A]">
              The county where the business is listed.
            </p>
            {fieldError && (
              <p id="county-error" role="alert" className="mb-1.5 text-[14px] font-bold text-[#A3243B]">
                There is a problem: {fieldError}
              </p>
            )}
            <select
              id="county"
              className={`${selectClass} ${fieldError ? 'border-[#A3243B]' : 'border-[#5F6F82]'}`}
              aria-describedby={fieldError ? 'county-hint county-error' : 'county-hint'}
              aria-invalid={fieldError ? 'true' : undefined}
              value={county}
              onChange={(e) => onCountyChange(e.target.value)}
            >
              <option value="">Choose a county</option>
              {/* Visitor sees Title Case; the option value is the all caps API value. */}
              {COUNTIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        className={`mt-5 rounded bg-[#14304F] px-6 py-3 text-[16px] font-bold text-white shadow-sm hover:bg-[#0E2238] disabled:cursor-wait disabled:opacity-70 ${focusRing}`}
        disabled={busy}
      >
        {busy ? 'Checking…' : 'Show license count'}
      </button>
    </form>
  )
}
