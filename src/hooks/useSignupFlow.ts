import { useState, useCallback } from 'react'

export type Step = 'account-type' | 'phone' | 'otp' | 'name' | 'password' | 'success'

export interface SignupData {
  accountType: 'personal' | 'business' | ''
  phone: string
  otp: string[]
  firstName: string
  lastName: string
  password: string
  confirmPassword: string
}

export interface StepErrors {
  accountType?: string
  phone?: string
  otp?: string
  firstName?: string
  lastName?: string
  password?: string
  confirmPassword?: string
}

const STEPS: Step[] = ['phone', 'otp', 'name', 'password']
const OTP_LENGTH = 4
const DEMO_OTP = '1234'

const PREV_STEP: Record<Step, Step | null> = {
  'account-type': null,
  phone: 'account-type',
  otp: 'phone',
  name: 'otp',
  password: 'name',
  success: 'password',
}

function validateStep(step: Step, data: SignupData): StepErrors {
  const e: StepErrors = {}

  if (step === 'account-type') {
    if (!data.accountType) e.accountType = 'Please select an account type.'
  }

  if (step === 'phone') {
    const digits = data.phone.replace(/\D/g, '')
    if (!data.phone.trim()) e.phone = 'Phone number is required.'
    else if (digits.length < 9)  e.phone = 'Please enter a valid phone number.'
  }

  if (step === 'otp') {
    const code = data.otp.join('')
    if (code.length < OTP_LENGTH) e.otp = 'Please enter the complete OTP.'
    else if (code !== DEMO_OTP)   e.otp = `Invalid OTP. (Demo: ${DEMO_OTP})`
  }

  if (step === 'name') {
    if (!data.firstName.trim()) e.firstName = 'First name is required.'
    if (!data.lastName.trim())  e.lastName  = 'Last name is required.'
  }

  if (step === 'password') {
    if (!data.password)                e.password = 'Password is required.'
    else if (data.password.length < 6) e.password = 'Must be at least 6 characters.'
    if (data.confirmPassword !== data.password) e.confirmPassword = 'Both passwords must match.'
  }

  return e
}

export function useSignupFlow() {
  const [step, setStep]       = useState<Step>('account-type')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState<StepErrors>({})
  const [otpHasError, setOtpHasError] = useState(false)

  const [data, setData] = useState<SignupData>({
    accountType: '',
    phone: '',
    otp: Array(OTP_LENGTH).fill(''),
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  })

  const stepIndex = STEPS.indexOf(step === 'success' ? 'password' : step)
  const progress  = ((stepIndex + 1) / STEPS.length) * 100

  const setField = useCallback(
    <K extends keyof SignupData>(key: K, value: SignupData[K]) => {
      setData(prev => ({ ...prev, [key]: value }))
      setErrors(prev => ({ ...prev, [key]: undefined }))
    },
    []
  )

  const setOtpDigit = useCallback((index: number, digit: string) => {
    setData(prev => {
      const next = [...prev.otp]
      next[index] = digit
      return { ...prev, otp: next }
    })
    setErrors(prev => ({ ...prev, otp: undefined }))
    setOtpHasError(false)
  }, [])

  const goBack = useCallback(() => {
    const prev = PREV_STEP[step]
    if (prev) { setStep(prev); setErrors({}) }
  }, [step])

  const goNext = useCallback(async () => {
    const validation = validateStep(step, data)

    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      if (step === 'otp' && validation.otp) {
        setOtpHasError(true)
        setData(prev => ({ ...prev, otp: Array(OTP_LENGTH).fill('') }))
      }
      return
    }

    setErrors({})
    setOtpHasError(false)
    setLoading(true)

    await new Promise(r => setTimeout(r, 700))
    setLoading(false)

    const nextMap: Record<Step, Step> = {
      'account-type': 'phone',
      phone: 'otp',
      otp: 'name',
      name: 'password',
      password: 'success',
      success: 'success',
    }
    setStep(nextMap[step])
  }, [step, data])

  const reset = useCallback(() => {
    setStep('account-type')
    setErrors({})
    setOtpHasError(false)
    setLoading(false)
    setData({
      accountType: '',
      phone: '',
      otp: Array(OTP_LENGTH).fill(''),
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    })
  }, [])

  const resendOtp = useCallback(async () => {
    setData(prev => ({ ...prev, otp: Array(OTP_LENGTH).fill('') }))
    setErrors(prev => ({ ...prev, otp: undefined }))
    setOtpHasError(false)
    await new Promise(r => setTimeout(r, 500))
  }, [])

  return {
    step,
    data,
    errors,
    loading,
    progress,
    otpHasError,
    setField,
    setOtpDigit,
    goBack,
    goNext,
    reset,
    resendOtp,
    OTP_LENGTH,
  }
}
