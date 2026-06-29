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
    // Wire the Download PDF button
    const btn = document.getElementById('download-btn')
    if (btn) {
      btn.addEventListener('click', handleDownload)
    }

    // Auto-trigger print or download after fonts/images load
    const timer = setTimeout(() => {
      if (autoPrint) {
        document.title = filename
        window.print()
      } else if (autoDownload) {
        handleDownload()
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
      if (btn) btn.removeEventListener('click', handleDownload)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDownload = async () => {
    try {
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || (html2pdfModule as any)
      const element = document.getElementById('contract-content')
      if (!element) return
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
      // Fallback to print if download fails
      window.print()
    }
  }

  return null
}
