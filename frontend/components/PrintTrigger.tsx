'use client'

import { useEffect } from 'react'

export default function PrintTrigger({
  autoPrint,
  autoDownload,
  filename,
  sequentialId,
  memberName,
}: {
  autoPrint: boolean
  autoDownload: boolean
  filename: string
  sequentialId: string
  memberName: string
}) {
  useEffect(() => {
    // Auto-trigger after page fully renders (fonts, images etc.)
    const timer = setTimeout(() => {
      if (autoPrint) {
        handlePrint()
      } else if (autoDownload) {
        handleDownload()
      }
    }, 1200)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePrint = () => {
    const prev = document.title
    document.title = filename
    window.print()
    document.title = prev
  }

  const handleDownload = async () => {
    try {
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || (html2pdfModule as any)
      const element = document.getElementById('contract-content')
      if (!element) { handlePrint(); return }
      const opt = {
        margin: 0,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      } as any
      await html2pdf().set(opt).from(element).save()
    } catch (err) {
      console.error('PDF generation failed', err)
      handlePrint() // fallback
    }
  }

  return (
    <div className="print-bar">
      <button className="btn-print" onClick={handlePrint}>🖨 Print / Save PDF</button>
      <button className="btn-download" onClick={handleDownload}>⬇ Download PDF</button>
    </div>
  )
}
