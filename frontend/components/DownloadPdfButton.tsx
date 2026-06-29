"use client"

import React, { useState, useEffect } from 'react'

export default function DownloadPdfButton({ 
  memberName, 
  sequentialId,
  autoDownload
}: { 
  memberName: string, 
  sequentialId: string,
  autoDownload?: boolean
}) {
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    if (autoDownload && mounted) {
      // Small delay to ensure images/fonts are loaded before auto-download
      timeoutId = setTimeout(() => {
        handleDownload()
      }, 800)
    }

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, [autoDownload])

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true)
      // Safely import html2pdf for both ESM and CJS
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || (html2pdfModule as any)
      
      const element = document.getElementById('contract-content')
      if (!element) {
        setIsDownloading(false)
        return
      }

      const opt = {
        margin:       0.5,
        filename:     `Milestone_Contract_${sequentialId}_${memberName.replace(/\\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      } as any
      
      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error("Failed to generate PDF", error)
      alert("Failed to download PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="mt-12 text-center print:hidden" data-html2canvas-ignore="true">
      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className="bg-black text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
      >
        {isDownloading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
  )
}
