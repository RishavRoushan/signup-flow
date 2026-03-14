import { useState } from 'react'
import { ShowEyeIcon, HideEyeIcon } from '../icon/Icon'

interface Props {
  password: string
  confirmPassword: string
  errors: { password?: string; confirmPassword?: string }
  onPassword: (v: string) => void
  onConfirmPassword: (v: string) => void
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <ShowEyeIcon />
    )
  }
  return (
    <HideEyeIcon />
  )
}

function getStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: '' }
  let score = 0
  if (pw.length >= 6)           score++
  if (pw.length >= 10)          score++
  if (/[A-Z]/.test(pw))         score++
  if (/[0-9]/.test(pw))         score++
  if (/[^A-Za-z0-9]/.test(pw))  score++

  if (score <= 1) return { score: 1, label: 'Weak' }
  if (score === 2) return { score: 2, label: 'Fair' }
  if (score === 3) return { score: 3, label: 'Good' }
  return { score: 4, label: 'Strong' }
}

export default function PasswordForm({
  password,
  confirmPassword,
  errors,
  onPassword,
  onConfirmPassword,
}: Props) {
  const [showPw, setShowPw]          = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { score, label } = getStrength(password)
  const barClass = (n: number) => (n <= score ? `strength-bar strength-bar--${score}` : 'strength-bar')

  const confirmMatch = confirmPassword.length > 0 && confirmPassword === password

  return (
    <div>
      <div className="field">
        <label className="field__label" htmlFor="password">
          Enter new password
        </label>
        <div className="field__input-wrap">
          <input
            id="password"
            className={`field__input${errors.password ? ' field__input--error' : ''}`}
            type={showPw ? 'text' : 'password'}
            placeholder="Enter new password"
            value={password}
            onChange={e => onPassword(e.target.value)}
            autoFocus
            autoComplete="new-password"
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            className="field__eye-btn"
            onClick={() => setShowPw(p => !p)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            <EyeIcon open={showPw} />
          </button>
        </div>

        {password.length > 0 && (
          <div className="password-form__strength">
            <div className="strength-bars">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className={barClass(n)} />
              ))}
            </div>
            <span className="strength-label">{label}</span>
          </div>
        )}

        {errors.password
          ? <p className="field__error">⚠ {errors.password}</p>
          : <p className="field__hint">Must be atleast 6 characters</p>
        }
      </div>

      <div className="field">
        <label className="field__label" htmlFor="confirmPassword">
          Confirm password
        </label>
        <div className="field__input-wrap">
          <input
            id="confirmPassword"
            className={[
              'field__input',
              errors.confirmPassword ? 'field__input--error' : '',
              confirmMatch         ? 'field__input--success' : '',
            ].filter(Boolean).join(' ')}
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => onConfirmPassword(e.target.value)}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
          />
          <button
            type="button"
            className="field__eye-btn"
            onClick={() => setShowConfirm(p => !p)}
            aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            tabIndex={-1}
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>

        {errors.confirmPassword
          ? <p className="field__error">⚠ {errors.confirmPassword}</p>
          : <p className="field__hint">Both passwords must match</p>
        }
      </div>
    </div>
  )
}
