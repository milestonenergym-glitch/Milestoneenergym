"use client"

import React, { useState } from 'react'

export default function DownloadPdfButton({ 
  memberName, 
  sequentialId 
}: { 
  memberName: string, 
  sequentialId: string 
}) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      // Dynamically import html2pdf.js to avoid SSR errors
      const html2pdf = (await import('html2pdf.js')).default
      
      const element = document.getElementById('contract-content')
      if (!element) return

      const opt = {
        margin:       0.5, // 0.5 inches all around
        filename:     `Milestone_Contract_${sequentialId}_${memberName.replace(/\s+/g, '_')}.pdf`,
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
