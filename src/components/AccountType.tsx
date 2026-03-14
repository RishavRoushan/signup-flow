import { PersonalIcon, BusinessIcon } from "../icon/Icon"

interface Props {
  value: 'personal' | 'business' | ''
  error?: string
  onChange: (v: 'personal' | 'business') => void
}

const OPTIONS = [
  {
    value: 'personal' as const,
    label: 'Personal',
    icon: <PersonalIcon />,
  },
  {
    value: 'business' as const,
    label: 'Business',
    icon: <BusinessIcon />,
  },
]

export default function AccountType({ value, error, onChange }: Props) {
  return (
    <div>
      <div className="account-type__options">
        {OPTIONS.map(opt => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              className={`account-type__option${active ? ' account-type__option--active' : ''}`}
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
            >
              <span className="account-type__icon">{opt.icon}</span>
              <span className="account-type__label">{opt.label}</span>
              <span 
              className="account-type__check" 
              aria-hidden="true">
                {active && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6.5L5 9L9.5 4"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {error && <p className="field__error" style={{ marginTop: 12 }}>⚠ {error}</p>}
    </div>
  )
}
