// Where the numbers come from, plus the not legal advice line.
export default function SourceNote() {
  return (
    <footer className="mt-12 bg-[#14304F] px-4 py-5 text-[14px] text-[#DCE5EF] md:px-6">
      <div className="mx-auto max-w-3xl space-y-1">
        <p>
          Source: TDLR All Licenses on{' '}
          <a
            href="https://data.texas.gov/d/7358-krk7"
            className="font-semibold text-white underline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#F2B807]"
          >
            data.texas.gov
          </a>{' '}
          (dataset 7358-krk7).
        </p>
        <p>General information, not legal advice.</p>
      </div>
    </footer>
  )
}
