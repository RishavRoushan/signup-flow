interface Props {
  firstName: string
  lastName: string
  errors: { firstName?: string; lastName?: string }
  onFirstName: (v: string) => void
  onLastName: (v: string) => void
}

export default function NameForm({
  firstName,
  lastName,
  errors,
  onFirstName,
  onLastName,
}: Props) {
  return (
    <div>
      <div className="field">
        <label className="field__label" htmlFor="firstName">
          First Name
        </label>
        <input
          id="firstName"
          className={`field__input${errors.firstName ? ' field__input--error' : ''}`}
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={e => onFirstName(e.target.value)}
          autoFocus
          autoComplete="given-name"
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
        />
        {errors.firstName && (
          <p id="firstName-error" className="field__error">⚠ {errors.firstName}</p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="lastName">
          Last Name
        </label>
        <input
          id="lastName"
          className={`field__input${errors.lastName ? ' field__input--error' : ''}`}
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => onLastName(e.target.value)}
          autoComplete="family-name"
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
        />
        {errors.lastName && (
          <p id="lastName-error" className="field__error">⚠ {errors.lastName}</p>
        )}
      </div>
    </div>
  )
}
