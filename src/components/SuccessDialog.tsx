
import { SuccessIcon, VerifiedIcon } from "../icon/Icon"
interface SummaryRow {
  key: string
  value: string
}

interface Props {
  accountType: string
  firstName: string
  lastName: string
  phone: string
  onDone: () => void
}

export default function SuccessDialog({
  accountType,
  firstName,
  lastName,
  phone,
  onDone,
}: Props) {
  const maskGmail = (email?: string) => {
    const normalized = (email ?? '').toLowerCase().trim()
    if (!normalized) return 'jo•••••@gmail.com'

    const local = normalized.split('@')[0]
    const start = local.slice(0, 2)
    const end = local.length > 4 ? local.slice(-2) : ''
    const masked = `${start}•••••${end}`

    return `${masked}@gmail.com`
  }

  const rows: SummaryRow[] = [
    { key: 'Account Type',  value: accountType ? accountType.charAt(0).toUpperCase() + accountType.slice(1) : 'Personal' },
    { key: 'Email',         value: maskGmail(firstName) },
    { key: 'Name',          value: `${firstName} ${lastName}`.trim() || 'John Doe' },
    { key: 'Mobile Number', value: phone || '9711677290' },
  ]

  return (
    <div className="success-overlay" role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div className="success-dialog">

        <div 
        className="success-dialog__icon" 
        aria-hidden="true">
         <SuccessIcon />
        </div>
        <h2 id="success-title" className="success-dialog__title">
          You're all set!
        </h2>
        <p className="success-dialog__subtitle">
          Here's a quick summary of your account details
        </p>
        <div className="success-dialog__table" role="table" aria-label="Account summary">
          {rows.map(row => (
            <div key={row.key} className="success-dialog__row" role="row">
              <span className="success-dialog__key" role="cell">{row.key}</span>
              <span className="success-dialog__val" role="cell">{row.value}</span>
            </div>
          ))}
        </div>
        <p className="success-dialog__security">
          <VerifiedIcon />
          Your account is secured with bank-grade security
        </p>
        <button
          type="button"
          className="success-dialog__cta"
          onClick={onDone}
        >
          Go To Dashboard
        </button>
      </div>
    </div>
  )
}
