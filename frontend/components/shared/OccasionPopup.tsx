'use client'

import { useEffect, useRef, useState } from 'react'
import { getGymSettings } from '@/app/actions/settings'
import { usePathname } from 'next/navigation'

export default function OccasionPopup() {
  const pathname = usePathname()
  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchPopup() {
      const settings = await getGymSettings()
      if (settings && settings.customPopupActive && settings.customPopupHtml) {
        setIsActive(true)
        setHtmlContent(settings.customPopupHtml)
      }
    }
    fetchPopup()
  }, [])

  useEffect(() => {
    // If we have content and it's active, we need to execute any script tags manually
    if (isActive && htmlContent && containerRef.current) {
      const scripts = containerRef.current.getElementsByTagName('script')
      const scriptsArray = Array.from(scripts)
      
      scriptsArray.forEach(script => {
        const newScript = document.createElement('script')
        if (script.src) {
          newScript.src = script.src
        } else {
          newScript.textContent = script.textContent
        }
        document.body.appendChild(newScript)
        
        // Remove the original unexecuted script to avoid duplicates in DOM
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      })
    }
  }, [isActive, htmlContent])

  if (!isActive || !htmlContent || pathname.startsWith('/admin')) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-none [&>*]:pointer-events-auto"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
