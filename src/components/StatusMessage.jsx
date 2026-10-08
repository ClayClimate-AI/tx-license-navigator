// One short line for screen readers and sighted visitors. The live region stays mounted
// so every status change is announced.
export default function StatusMessage({ status, type, county, errorCode }) {
  let text
  if (status === 'loading') {
    text = 'Checking Texas license records.'
  } else if (status === 'success') {
    text = `Done. Showing results for ${type} in ${county} County.`
  } else if (status === 'empty') {
    text = `Done. No matching records for ${type} in ${county} County.`
  } else if (status === 'error') {
    const code = errorCode === null ? 'no connection' : `error ${errorCode}`
    text = `Something went wrong (${code}). Your choices are saved.`
  } else {
    text = 'Ready. Choose a license type and a county.'
  }

  return (
    <p role="status" aria-live="polite">
      {text}
    </p>
  )
}
