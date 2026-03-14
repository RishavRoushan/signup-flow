
import { useSignupFlow } from '../hooks/useSignupFlow'
import AccountType from '../components/AccountType'
import { PhoneInput, OTPBoxes } from '../components/OTPInput'
import NameForm from '../components/NameForm'
import PasswordForm from '../components/PasswordForm'
import SuccessDialog from '../components/SuccessDialog'
import Illustration from '../components/Illustration'

const STEP_TITLE: Record<string, string> = {
  'account-type':  'account-type',
  phone:           'OTP Verification',
  otp:             'OTP Verification',
  name:            'What is your name?',
  password:        'Create Password for your account',
  success:         'Create Password for your account',
}

export default function SignupFlow() {
  const flow = useSignupFlow()

  return (
    <div className="signup-shell">
      <div 
      style={{display: "flex", flexDirection: "row", justifyContent:"center", height: "100%", width: "100%", padding: "24px 8px 4px", }}
      >
        <div className="panel-left">
          <span className="panel-left__eyebrow">Let's get started</span>
          <h1 className="panel-left__heading">Create your account</h1>
          <p className="panel-left__sub">Follow the steps to create your account</p>

          <div className="panel-left__illustration">
            <Illustration />
          </div>
        </div>
        <div style={{width: "50%", height: "100%"}}>
           {flow?.progress >0 ?(<div className="progress-bar" role="progressbar" aria-valuenow={flow.progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-bar__fill" style={{ width: `${flow.progress}%` }} />
            </div>) : (<div style={{ height: "10px",}} />)}
          <div className="panel-right">       
            <div className="panel-right__inner" key={flow.step}>
              <h2 className="panel-right__title">{STEP_TITLE[flow.step] === "account-type" ? <p className="account-type__desc">
          To join us tell us <strong>what type of account</strong> <br/>you are opening
        </p> : STEP_TITLE[flow.step]}</h2>

              <div className="panel-right__body">
                {flow.step === 'account-type' && (
                  <AccountType
                    value={flow.data.accountType}
                    error={flow.errors.accountType}
                    onChange={v => flow.setField('accountType', v)}
                  />
                )}

                {flow.step === 'phone' && (
                  <PhoneInput
                    value={flow.data.phone}
                    error={flow.errors.phone}
                    onChange={v => flow.setField('phone', v)}
                  />
                )}

                {flow.step === 'otp' && (
                  <OTPBoxes
                    otp={flow.data.otp}
                    hasError={flow.otpHasError}
                    error={flow.errors.otp}
                    phone={flow.data.phone}
                    onChange={(i, d) => flow.setOtpDigit(i, d)}
                    onResend={flow.resendOtp}
                  />
                )}

                {flow.step === 'name' && (
                  <NameForm
                    firstName={flow.data.firstName}
                    lastName={flow.data.lastName}
                    errors={{ firstName: flow.errors.firstName, lastName: flow.errors.lastName }}
                    onFirstName={v => flow.setField('firstName', v)}
                    onLastName={v => flow.setField('lastName', v)}
                  />
                )}

                {flow.step === 'password' && (
                  <PasswordForm
                    password={flow.data.password}
                    confirmPassword={flow.data.confirmPassword}
                    errors={{ password: flow.errors.password, confirmPassword: flow.errors.confirmPassword }}
                    onPassword={v => flow.setField('password', v)}
                    onConfirmPassword={v => flow.setField('confirmPassword', v)}
                  />
                )}
              </div>

              <div className="nav-row">
                <button
                  type="button"
                  className="btn-back"
                  onClick={flow.goBack}
                  disabled={flow.loading}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn-continue"
                  onClick={flow.goNext}
                  disabled={flow.loading}
                >
                  {flow.loading
                    ? <span className="btn-spinner" aria-label="Loading" />
                    : flow.step === 'password' ? 'Continue' : 'Continue'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {flow.step === 'success' && (
        <SuccessDialog
          accountType={flow.data.accountType}
          firstName={flow.data.firstName}
          lastName={flow.data.lastName}
          phone={flow.data.phone}
          onDone={flow.reset}
        />
      )}
    </div>
  )
}
