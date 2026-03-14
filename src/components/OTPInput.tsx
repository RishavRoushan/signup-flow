import { useRef, useState } from 'react'
import { USFlagIcon, SearchIcon, ChevronDown } from '../icon/Icon'

interface Country {
  code: string
  iso: string
  name: string
  flag: React.ReactNode}

const COUNTRIES: Country[] = [
  { code: '+1',   iso: 'US', name: 'United States', flag: <USFlagIcon/> },
  { code: '+1',   iso: 'CA', name: 'Canada',         flag: '🇨🇦' },
  { code: '+44',  iso: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91',  iso: 'IN', name: 'India',           flag: '🇮🇳' },
  { code: '+61',  iso: 'AU', name: 'Australia',       flag: '🇦🇺' },
  { code: '+49',  iso: 'DE', name: 'Germany',         flag: '🇩🇪' },
  { code: '+33',  iso: 'FR', name: 'France',          flag: '🇫🇷' },
  { code: '+39',  iso: 'IT', name: 'Italy',           flag: '🇮🇹' },
  { code: '+34',  iso: 'ES', name: 'Spain',           flag: '🇪🇸' },
  { code: '+81',  iso: 'JP', name: 'Japan',           flag: '🇯🇵' },
  { code: '+86',  iso: 'CN', name: 'China',           flag: '🇨🇳' },
  { code: '+55',  iso: 'BR', name: 'Brazil',          flag: '🇧🇷' },
  { code: '+52',  iso: 'MX', name: 'Mexico',          flag: '🇲🇽' },
  { code: '+27',  iso: 'ZA', name: 'South Africa',    flag: '🇿🇦' },
  { code: '+82',  iso: 'KR', name: 'South Korea',     flag: '🇰🇷' },
  { code: '+65',  iso: 'SG', name: 'Singapore',       flag: '🇸🇬' },
]

interface PhoneInputProps {
  value: string
  error?: string
  onChange: (v: string) => void
}

export function PhoneInput({ value, error, onChange }: PhoneInputProps) {
   const [selected, setSelected] = useState<Country>(COUNTRIES[0])
  const [open, setOpen]         = useState(false)
  const [search, setSearch]     = useState('')
  const wrapRef                  = useRef<HTMLDivElement>(null)

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  )

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!wrapRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false)
      setSearch('')
    }
  }

  const select = (c: Country) => {
    setSelected(c)
    setOpen(false)
    setSearch('')
  }
  return (
    <div>
      <label className="field__label field__label--required">Mobile Number</label>

      <div className="phone-row">
        <div
          ref={wrapRef}
          className={`phone-country-box${open ? ' phone-country-box--open' : ''}${error ? ' phone-country-box--error' : ''}`}
          onBlur={handleBlur}
          tabIndex={0}
        >
          <button
            type="button"
            className="phone-country-btn"
            onClick={() => { setOpen(p => !p); setSearch('') }}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Country code: ${selected.code}`}
          >
            <span className="phone-flag">{selected.flag}</span>
            <span className="phone-dialcode">{selected.code}</span>
            <span className={`phone-chevron${open ? ' phone-chevron--up' : ''}`}>
              <ChevronDown />
            </span>
          </button>

          {open && (
            <div className="phone-dropdown" role="listbox">
              <div className="phone-dropdown__search-wrap">
                <SearchIcon/>
                <input
                  className="phone-dropdown__search"
                  type="text"
                  placeholder="Search country…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <ul className="phone-dropdown__list">
                {filtered.length === 0 && (
                  <li className="phone-dropdown__empty">No results</li>
                )}
                {filtered.map((c, i) => (
                  <li
                    key={`${c.iso}-${i}`}
                    role="option"
                    aria-selected={c.iso === selected.iso}
                    className={`phone-dropdown__item${c.iso === selected.iso ? ' phone-dropdown__item--active' : ''}`}
                    onMouseDown={() => select(c)}
                  >
                    <span className="phone-dropdown__flag">{c.flag}</span>
                    <span className="phone-dropdown__name">{c.name}</span>
                    <span className="phone-dropdown__code">{c.code}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Number input */}
        <div className={`phone-number-box${error ? ' phone-number-box--error' : ''}`}>
          <input
            className="phone-number-input"
            type="tel"
            placeholder="Enter your mobile number"
            value={value}
            onChange={e => onChange(e.target.value)}
            autoFocus
            autoComplete="tel"
            aria-label="Phone number"
            aria-invalid={!!error}
          />
        </div>
      </div>

      {error && <p className="field__error">⚠ {error}</p>}
    </div>
  )
}


interface OTPBoxesProps {
  otp: string[]
  hasError: boolean
  error?: string
  phone: string
  onChange: (index: number, digit: string) => void
  onResend: () => void
}

export function OTPBoxes({ otp, hasError, error, phone, onChange, onResend }: OTPBoxesProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    onChange(i, val.slice(-1))
    if (val && i < otp.length - 1) {
      inputRefs.current[i + 1]?.focus()
    }
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, otp.length)
    digits.split('').forEach((d, i) => onChange(i, d))
    const focusIdx = Math.min(digits.length, otp.length - 1)
    inputRefs.current[focusIdx]?.focus()
  }

  const maskedPhone = phone
    ? phone.replace(/(\d{3})\d+(\d{2})/, '$1•••••$2')
    : 'your mobile number'

  return (
    <div style={{width: "90%"}}>
      <p className="otp__hint">
        An OTP has been sent to your mobile number{' '}
        <strong style={{ color: 'var(--text-dark)' }}>{maskedPhone}</strong>
      </p>

      <div className="otp__boxes" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            ref={el => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={[
              'otp__box',
              digit ? 'otp__box--filled' : '',
              hasError ? 'otp__box--error' : '',
            ].filter(Boolean).join(' ')}
            autoFocus={i === 0}
            aria-label={`OTP digit ${i + 1}`}
            aria-invalid={hasError}
          />
        ))}
      </div>

      {error && (
        <div style={{display: "flex", justifyContent: "flex-end"}}>
          <p className="field__error">⚠ {error}</p>
        </div>
      )}

      <div style={{display: "flex", justifyContent: "flex-end"}}>
        <p className="otp__resend">
          Did not receive OTP?{' '}
          <button type="button" className="otp__resend-link" onClick={onResend}>
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  )
}
