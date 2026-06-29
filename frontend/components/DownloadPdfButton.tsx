"use client"

import React, { useState, useEffect } from 'react'

export default function DownloadPdfButton({ 
  memberName, 
  sequentialId,
  autoDownload,
  autoPrint
}: { 
  memberName: string, 
  sequentialId: string,
  autoDownload?: boolean,
  autoPrint?: boolean
}) {
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    if (autoDownload && mounted) {
      timeoutId = setTimeout(() => {
        handleDownload()
      }, 800)
    } else if (autoPrint && mounted) {
      timeoutId = setTimeout(() => {
        handlePrint()
      }, 800)
    }

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, [autoDownload, autoPrint])

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Milestone_Contract_${sequentialId}_${memberName.replace(/\s+/g, '_')}`;
    window.print();
    document.title = originalTitle;
  }

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true)
      
      window.scrollTo(0, 0);

      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || (html2pdfModule as any)
      
      const element = document.getElementById('contract-content')
      if (!element) {
        setIsDownloading(false)
        return
      }

      const opt = {
        margin:       0,
        filename:     `Milestone_Contract_${sequentialId}_${memberName.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      } as any
      
      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error("Failed to generate PDF", error)
      alert("Failed to download PDF: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="mt-12 text-center print:hidden flex justify-center gap-4" data-html2canvas-ignore="true">
      <button 
        onClick={handlePrint}
        className="bg-zinc-800 text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        Print
      </button>
      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className="bg-black text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors cursor-pointer disabled:opacity-50"
      >
        {isDownloading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
  )
}
