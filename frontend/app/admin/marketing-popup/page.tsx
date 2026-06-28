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
  #occasion-popup-overlay *{box-sizing:border-box;margin:0;padding:0;}
  .overlay{
    min-height:600px;
    background:rgba(0,0,0,0.82);
    display:flex;align-items:center;justify-content:center;
    padding:20px;
    font-family:'Rajdhani',sans-serif;
  }
  .popup{
    background:#0d1117;
    border:1.5px solid #1E3A5F;
    border-radius:16px;
    width:100%;max-width:560px;
    overflow:hidden;
    position:relative;
  }
  .top-bar{
    background:linear-gradient(90deg,#0B2A6E 0%,#1a4fbd 50%,#B8860B 100%);
    padding:10px 20px;
    text-align:center;
    font-size:13px;
    font-weight:700;
    color:#fff;
    letter-spacing:2px;
    text-transform:uppercase;
  }
  .main-box{padding:28px 32px 24px;position:relative;}
  .logo-row{display:flex;align-items:center;gap:14px;margin-bottom:20px;}
  .logo-img{width:64px;height:64px;border-radius:50%;border:2.5px solid #B8860B;object-fit:cover;}
  .brand-name{display:flex;flex-direction:column;}
  .brand-name span:first-child{
    font-family:'Bebas Neue',sans-serif;
    font-size:28px;color:#1a6ed8;letter-spacing:2px;line-height:1;
  }
  .brand-name span:last-child{
    font-size:12px;color:#B8860B;letter-spacing:4px;text-transform:uppercase;font-weight:700;
  }
  .badge{
    background:#B8860B;color:#fff;
    font-size:11px;font-weight:700;
    padding:4px 12px;border-radius:20px;
    text-transform:uppercase;letter-spacing:1px;
    display:inline-block;margin-bottom:12px;
  }
  .headline{
    font-family:'Bebas Neue',sans-serif;
    font-size:48px;color:#fff;
    line-height:1;
    margin-bottom:4px;
  }
  .headline span{color:#B8860B;}
  .sub-headline{
    font-size:18px;color:#a0b4d0;font-weight:500;
    margin-bottom:20px;letter-spacing:0.5px;
  }
  .divider{height:1px;background:linear-gradient(90deg,transparent,#1a4fbd,#B8860B,transparent);margin:16px 0;}
  .offer-box{
    background:#0a1628;border:1px solid #1E3A5F;
    border-radius:10px;padding:16px 20px;margin-bottom:20px;
    text-align:center;
  }
  .offer-label{font-size:12px;color:#8aa6c4;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;}
  .offer-value{
    font-family:'Bebas Neue',sans-serif;
    font-size:64px;
    background:linear-gradient(135deg,#1a6ed8,#B8860B);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    line-height:1;margin-bottom:4px;
  }
  .offer-sub{font-size:13px;color:#a0b4d0;font-weight:500;}
  .details-row{display:flex;gap:12px;margin-bottom:20px;}
  .detail-card{
    flex:1;background:#0a1628;border:1px solid #1E3A5F;
    border-radius:8px;padding:12px;text-align:center;
  }
  .detail-card .icon{font-size:20px;margin-bottom:4px;}
  .detail-card .d-label{font-size:10px;color:#8aa6c4;text-transform:uppercase;letter-spacing:1px;}
  .detail-card .d-val{font-size:15px;color:#fff;font-weight:700;}
  .cta-btn{
    display:block;width:100%;
    background:linear-gradient(90deg,#0B2A6E,#1a4fbd);
    color:#fff;border:none;
    border-radius:10px;padding:16px;
    font-family:'Bebas Neue',sans-serif;
    font-size:22px;letter-spacing:3px;
    cursor:pointer;text-align:center;
    text-decoration:none;
    transition:opacity 0.2s;
    margin-bottom:10px;
  }
  .cta-btn:hover{opacity:0.88;}
  .cta-btn2{
    display:block;width:100%;
    background:transparent;
    color:#B8860B;border:1.5px solid #B8860B;
    border-radius:10px;padding:12px;
    font-family:'Bebas Neue',sans-serif;
    font-size:18px;letter-spacing:2px;
    cursor:pointer;text-align:center;
    text-decoration:none;
    transition:all 0.2s;
    margin-bottom:14px;
  }
  .cta-btn2:hover{background:#B8860B22;}
  .footnote{text-align:center;font-size:11px;color:#4a6380;letter-spacing:0.5px;}
  .close-btn{
    position:absolute;top:14px;right:16px;
    background:none;border:none;color:#4a6380;
    font-size:22px;cursor:pointer;line-height:1;
    z-index: 50;
  }
  .close-btn:hover{color:#fff;}
  .countdown-row{
    display:flex;justify-content:center;gap:16px;margin-bottom:18px;
  }
  .c-block{text-align:center;}
  .c-num{
    font-family:'Bebas Neue',sans-serif;
    font-size:36px;color:#1a6ed8;
    background:#0a1628;
    border:1px solid #1E3A5F;
    border-radius:6px;
    padding:4px 12px;min-width:56px;
    display:inline-block;line-height:1.1;
  }
  .c-lab{font-size:10px;color:#8aa6c4;text-transform:uppercase;letter-spacing:1px;margin-top:3px;}
</style>
<div class="overlay" id="occasion-popup-overlay">
  <div class="popup">
    <div class="top-bar">⚡ Grand Opening Special — Limited Offer ⚡</div>
    <div class="main-box">
      <button class="close-btn" onclick="document.getElementById('occasion-popup-overlay').style.display='none'">✕</button>
      <div class="logo-row">
        <img class="logo-img" src="/logo.jpg" alt="Milestone Energym Logo" onerror="this.style.display='none'"/>
        <div class="brand-name">
          <span>MILESTONE</span>
          <span>—ENERGYM—</span>
        </div>
      </div>
      <span class="badge">🎉 Grand Opening — 9th July 2025</span>
      <div class="headline">WE ARE<span> OPEN!</span></div>
      <div class="sub-headline">Train Hard. Stay Strong. Transform Now.</div>
      <div class="divider"></div>
      <div class="offer-box">
        <div class="offer-label">Opening Day Exclusive</div>
        <div class="offer-value">20% OFF</div>
        <div class="offer-sub">On All Membership Joining — 9th July Only</div>
      </div>
      <div class="details-row">
        <div class="detail-card">
          <div class="icon">📅</div>
          <div class="d-label">Date</div>
          <div class="d-val">9th July 2025</div>
        </div>
        <div class="detail-card">
          <div class="icon">🕙</div>
          <div class="d-label">Opens At</div>
          <div class="d-val">10:00 AM</div>
        </div>
        <div class="detail-card">
          <div class="icon">📍</div>
          <div class="d-label">Location</div>
          <div class="d-val">Barmer, Raj.</div>
        </div>
      </div>
      <div class="countdown-row">
        <div class="c-block"><div class="c-num" id="cd-d">--</div><div class="c-lab">Days</div></div>
        <div class="c-block"><div class="c-num" id="cd-h">--</div><div class="c-lab">Hours</div></div>
        <div class="c-block"><div class="c-num" id="cd-m">--</div><div class="c-lab">Mins</div></div>
        <div class="c-block"><div class="c-num" id="cd-s">--</div><div class="c-lab">Secs</div></div>
      </div>
      <a class="cta-btn" href="/membership" target="_blank">⚡ CLAIM 20% OFF — JOIN NOW</a>
      <a class="cta-btn2" href="https://wa.me/918875305442?text=Hi!%20I%20want%20to%20claim%20the%20Grand%20Opening%2020%25%20Off%20offer!" target="_blank">💬 WhatsApp Us to Book</a>
      <div class="footnote">नवलाराम की चक्की, Near Crown Plaza NH68, Barmer, Rajasthan — 344001<br>Offer valid on 9th July 2025 only. Limited memberships at this price.</div>
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
