/**
 * This layout hides the admin sidebar and header for the contract/print page
 * so that window.print() captures only the clean contract document.
 */
export default function ContractLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide admin sidebar and topbar on the contract page */
        aside, header { display: none !important; }
        /* Remove the flex container padding so contract fills full width */
        main { padding: 0 !important; background: #e8ecf4 !important; overflow: visible !important; }
        div[class*="max-w-7xl"] { max-width: none !important; margin: 0 !important; padding: 0 !important; }
        /* Hide the flex wrapper constraints */
        body > div, body > div > div { overflow: visible !important; }
      `}</style>
      {children}
    </>
  )
}
