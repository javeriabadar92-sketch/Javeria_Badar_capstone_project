export type SettingsValues = {
  displayName: string
  email: string
  bio: string
  timezone: string
  theme: 'light' | 'dark' | 'system'
  emailNotifications: boolean
  weeklyDigest: boolean
  openaiApiKey: string
}

export type SettingsErrors = Partial<Record<keyof SettingsValues, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const API_KEY_PATTERN = /^sk-[a-zA-Z0-9_-]{20,}$/

export function validateSettings(values: SettingsValues): SettingsErrors {
  const errors: SettingsErrors = {}

  const displayName = values.displayName.trim()
  if (!displayName) {
    errors.displayName = 'Display name is required.'
  } else if (displayName.length < 2) {
    errors.displayName = 'Display name must be at least 2 characters.'
  } else if (displayName.length > 50) {
    errors.displayName = 'Display name must be 50 characters or fewer.'
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  const bio = values.bio.trim()
  if (bio.length > 500) {
    errors.bio = 'Bio must be 500 characters or fewer.'
  }

  if (!values.timezone) {
    errors.timezone = 'Select a timezone.'
  }

  const apiKey = values.openaiApiKey.trim()
  if (apiKey && !API_KEY_PATTERN.test(apiKey)) {
    errors.openaiApiKey =
      'API key must start with "sk-" and contain at least 20 characters.'
  }

  return errors
}

export function hasErrors(errors: SettingsErrors): boolean {
  return Object.keys(errors).length > 0
}
