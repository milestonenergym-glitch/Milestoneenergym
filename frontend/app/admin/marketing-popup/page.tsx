'use client'

import { useState, useEffect } from 'react'
import { getGymSettings, updateGymSettings } from '@/app/actions/settings'
import { Save, AlertCircle, Eye } from 'lucide-react'

export default function MarketingPopupAdmin() {
  const [htmlCode, setHtmlCode] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadSettings() {
      const settings = await getGymSettings()
      if (settings) {
        setHtmlCode(settings.customPopupHtml || '')
        setIsActive(settings.customPopupActive || false)
      }
      setLoading(false)
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    const res = await updateGymSettings({
      customPopupHtml: htmlCode,
      customPopupActive: isActive
    })

    if (res.success) {
      setMessage('Marketing popup settings saved successfully!')
    } else {
      setMessage('Failed to save settings. Please try again.')
    }
    setSaving(false)
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000)
  }

  const defaultHTML = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@500;700&display=swap');
  #me-occasion-popup * { box-sizing: border-box; margin: 0; padding: 0; }
  .me-overlay {
    position: fixed; inset: 0;
    min-height: 100vh;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    font-family: 'Rajdhani', sans-serif;
    z-index: 999999;
  }
  .me-popup {
    background: #0d1117;
    border: 1.5px solid #1E3A5F;
    border-radius: 16px;
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
  .me-top-bar {
    background: linear-gradient(90deg,#0B2A6E 0%,#1a4fbd 50%,#B8860B 100%);
    padding: 10px 20px;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .me-main-box { padding: 28px 32px 24px; position: relative; }
  .me-logo-row { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .me-logo-img { width: 64px; height: 64px; border-radius: 50%; border: 2.5px solid #B8860B; object-fit: cover; }
  .me-brand-name { display: flex; flex-direction: column; }
  .me-brand-name span:first-child {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; color: #1a6ed8; letter-spacing: 2px; line-height: 1;
  }
  .me-brand-name span:last-child {
    font-size: 12px; color: #B8860B; letter-spacing: 4px; text-transform: uppercase; font-weight: 700;
  }
  .me-badge {
    background: #B8860B; color: #fff;
    font-size: 11px; font-weight: 700;
    padding: 4px 12px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 1px;
    display: inline-block; margin-bottom: 12px;
  }
  .me-headline {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px; color: #fff;
    line-height: 1;
    margin-bottom: 4px;
  }
  .me-headline span { color: #B8860B; }
  .me-sub-headline {
    font-size: 18px; color: #a0b4d0; font-weight: 500;
    margin-bottom: 20px; letter-spacing: 0.5px;
  }
  .me-divider { height: 1px; background: linear-gradient(90deg,transparent,#1a4fbd,#B8860B,transparent); margin: 16px 0; }
  .me-offer-box {
    background: #0a1628; border: 1px solid #1E3A5F;
    border-radius: 10px; padding: 16px 20px; margin-bottom: 20px;
    text-align: center;
  }
  .me-offer-label { font-size: 12px; color: #8aa6c4; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; }
  .me-offer-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 64px;
    background: linear-gradient(135deg,#1a6ed8,#B8860B);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1; margin-bottom: 4px;
  }
  .me-offer-sub { font-size: 13px; color: #a0b4d0; font-weight: 500; }
  .me-details-row { display: flex; gap: 12px; margin-bottom: 20px; }
  .me-detail-card {
    flex: 1; background: #0a1628; border: 1px solid #1E3A5F;
    border-radius: 8px; padding: 12px; text-align: center;
  }
  .me-detail-card .me-icon { font-size: 20px; margin-bottom: 4px; }
  .me-detail-card .me-d-label { font-size: 10px; color: #8aa6c4; text-transform: uppercase; letter-spacing: 1px; }
  .me-detail-card .me-d-val { font-size: 15px; color: #fff; font-weight: 700; }
  .me-cta-btn {
    display: block; width: 100%;
    background: linear-gradient(90deg,#0B2A6E,#1a4fbd);
    color: #fff; border: none;
    border-radius: 10px; padding: 16px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; letter-spacing: 3px;
    cursor: pointer; text-align: center;
    text-decoration: none;
    transition: opacity 0.2s;
    margin-bottom: 10px;
  }
  .me-cta-btn:hover { opacity: 0.88; }
  .me-cta-btn2 {
    display: block; width: 100%;
    background: transparent;
    color: #B8860B; border: 1.5px solid #B8860B;
    border-radius: 10px; padding: 12px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px; letter-spacing: 2px;
    cursor: pointer; text-align: center;
    text-decoration: none;
    transition: all 0.2s;
    margin-bottom: 14px;
  }
  .me-cta-btn2:hover { background: #B8860B22; }
  .me-footnote { text-align: center; font-size: 11px; color: #4a6380; letter-spacing: 0.5px; }
  .me-close-btn {
    position: absolute; top: 14px; right: 16px;
    background: none; border: none; color: #4a6380;
    font-size: 22px; cursor: pointer; line-height: 1;
    z-index: 50;
  }
  .me-close-btn:hover { color: #fff; }
  .me-countdown-row {
    display: flex; justify-content: center; gap: 16px; margin-bottom: 18px;
  }
  .me-c-block { text-align: center; }
  .me-c-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px; color: #1a6ed8;
    background: #0a1628;
    border: 1px solid #1E3A5F;
    border-radius: 6px;
    padding: 4px 12px; min-width: 56px;
    display: inline-block; line-height: 1.1;
  }
  .me-c-lab { font-size: 10px; color: #8aa6c4; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }
<div class="me-overlay" id="occasion-popup-overlay">
  <div class="me-popup">
    <div class="me-top-bar">⚡ Grand Opening Special — Limited Offer ⚡</div>
    <div class="me-main-box">
      <button class="me-close-btn" onclick="document.getElementById('occasion-popup-overlay').style.display='none'">✕</button>
      <div class="me-logo-row">
        <img class="me-logo-img" src="/logo.jpg" alt="Milestone Energym Logo" onerror="this.style.display='none'"/>
        <div class="me-brand-name">
          <span>MILESTONE</span>
          <span>—ENERGYM—</span>
        </div>
      </div>
      <span class="me-badge">🎉 Grand Opening — 9th July 2025</span>
      <div class="me-headline">WE ARE<span> OPEN!</span></div>
      <div class="me-sub-headline">Train Hard. Stay Strong. Transform Now.</div>
      <div class="me-divider"></div>
      <div class="me-offer-box">
        <div class="me-offer-label">Opening Day Exclusive</div>
        <div class="me-offer-value">20% OFF</div>
        <div class="me-offer-sub">On All Membership Joining — 9th July Only</div>
      </div>
      <div class="me-details-row">
        <div class="me-detail-card">
          <div class="me-icon">📅</div>
          <div class="me-d-label">Date</div>
          <div class="me-d-val">9th July 2025</div>
        </div>
        <div class="me-detail-card">
          <div class="me-icon">🕙</div>
          <div class="me-d-label">Opens At</div>
          <div class="me-d-val">10:00 AM</div>
        </div>
        <div class="me-detail-card">
          <div class="me-icon">📍</div>
          <div class="me-d-label">Location</div>
          <div class="me-d-val">Barmer, Raj.</div>
        </div>
      </div>
      <div class="me-countdown-row">
        <div class="me-c-block"><div class="me-c-num" id="cd-d">--</div><div class="me-c-lab">Days</div></div>
        <div class="me-c-block"><div class="me-c-num" id="cd-h">--</div><div class="me-c-lab">Hours</div></div>
        <div class="me-c-block"><div class="me-c-num" id="cd-m">--</div><div class="me-c-lab">Mins</div></div>
        <div class="me-c-block"><div class="me-c-num" id="cd-s">--</div><div class="me-c-lab">Secs</div></div>
      </div>
      <a class="me-cta-btn" href="/membership" target="_blank">⚡ CLAIM 20% OFF — JOIN NOW</a>
      <a class="me-cta-btn2" href="https://wa.me/918875305442?text=Hi!%20I%20want%20to%20claim%20the%20Grand%20Opening%2020%25%20Off%20offer!" target="_blank">💬 WhatsApp Us to Book</a>
      <div class="me-footnote">नवलाराम की चक्की, Near Crown Plaza NH68, Barmer, Rajasthan — 344001<br>Offer valid on 9th July 2025 only. Limited memberships at this price.</div>
    </div>
  </div>
</div>
<script>
window.popupCountdownTimer = setInterval(function(){
  var target = new Date('2025-07-09T10:00:00+05:30').getTime();
  var now = new Date().getTime();
  var diff = target - now;
  var dEl = document.getElementById('cd-d');
  if(!dEl) {
     clearInterval(window.popupCountdownTimer);
     return;
  }
  if(diff <= 0){
    dEl.textContent = '00';
    document.getElementById('cd-h').textContent = '00';
    document.getElementById('cd-m').textContent = '00';
    document.getElementById('cd-s').textContent = '00';
    return;
  }
  var d = Math.floor(diff / (1000 * 60 * 60 * 24));
  var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  var s = Math.floor((diff % (1000 * 60)) / 1000);
  dEl.textContent = String(d).padStart(2, '0');
  document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
}, 1000);
</script>`

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading settings...</div>
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Marketing Popup</h1>
          <p className="text-sm text-zinc-400">Manage special occasion banners and promotional popups for your website.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-brand-gold-400 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          message.includes('successfully') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{message}</p>
        </div>
      )}

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        
        {/* Toggle Switch */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white mb-1">Enable Custom Popup</h3>
            <p className="text-sm text-zinc-400">When enabled, this popup will show up on your website over the regular free trial popup.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        {/* HTML Editor */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Custom HTML, CSS & JavaScript Code</h3>
            {htmlCode.trim() === '' && (
              <button 
                onClick={() => setHtmlCode(defaultHTML)}
                className="text-xs text-brand-gold hover:underline flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                Load Grand Opening Template
              </button>
            )}
          </div>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            className="w-full h-[500px] bg-zinc-950 border border-white/10 rounded-lg p-4 text-zinc-300 font-mono text-sm focus:outline-none focus:border-brand-gold custom-scrollbar"
            placeholder="<!-- Paste your custom HTML, CSS (<style>) and JS (<script>) here -->"
          />
          <p className="text-xs text-zinc-500 mt-2">
            Note: Avoid using identical classes to the main website to prevent styling conflicts. The code will be injected directly into the body.
          </p>
        </div>

      </div>
    </div>
  )
}
