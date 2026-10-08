import { HVAC_TYPES } from '../api/tdlr.js'
import { COUNTIES } from '../data/counties.js'

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
    <form onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>Choose a license and a county</legend>

        <div>
          <label htmlFor="license-type" className="block">
            License type
          </label>
          <p id="license-type-hint">Technicians work for a company. Contractors run the business.</p>
          <select
            id="license-type"
            className="border"
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

        <div>
          <label htmlFor="county" className="block">
            County
          </label>
          <p id="county-hint">The county where the business is listed.</p>
          {fieldError && (
            <p id="county-error" role="alert">
              There is a problem: {fieldError}
            </p>
          )}
          <select
            id="county"
            className="border"
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
      </fieldset>

      <button type="submit" className="border" disabled={busy}>
        Show license count
      </button>
    </form>
  )
}
