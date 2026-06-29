"use client"

import React, { useEffect } from 'react'

export default function DownloadPdfButton({ 
  memberName, 
  sequentialId,
  autoDownload
}: { 
  memberName: string, 
  sequentialId: string,
  autoDownload?: boolean
}) {

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    if (autoDownload && mounted) {
      // Small delay to ensure images/fonts are loaded before auto-print
      timeoutId = setTimeout(() => {
        handlePrint()
      }, 800)
    }

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, [autoDownload])

  const handlePrint = () => {
    // We dynamically set document title so that the default save name in Chrome's "Save as PDF" is nice
    const originalTitle = document.title;
    document.title = `Milestone_Contract_${sequentialId}_${memberName.replace(/\s+/g, '_')}`;
    
    window.print();
    
    // Restore original title after print dialog closes
    document.title = originalTitle;
  }

  return (
    <div className="mt-12 text-center print:hidden">
      <button 
        onClick={handlePrint}
        className="bg-black text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
      >
        Print / Save PDF
      </button>
    </div>
  )
}
