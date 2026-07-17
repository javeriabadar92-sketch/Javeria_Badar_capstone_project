import { useState, type FormEvent } from 'react'
import {
  hasErrors,
  validateSettings,
  type SettingsErrors,
  type SettingsValues,
} from '../lib/validate-settings'
import './settings-form.css'

const DEFAULT_VALUES: SettingsValues = {
  displayName: '',
  email: '',
  bio: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  theme: 'system',
  emailNotifications: true,
  weeklyDigest: false,
  openaiApiKey: '',
}

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Karachi',
  'Asia/Tokyo',
  'Australia/Sydney',
  'UTC',
]

type TouchedFields = Partial<Record<keyof SettingsValues, boolean>>

export default function SettingsForm() {
  const [values, setValues] = useState<SettingsValues>(DEFAULT_VALUES)
  const [errors, setErrors] = useState<SettingsErrors>({})
  const [touched, setTouched] = useState<TouchedFields>({})
  const [submitted, setSubmitted] = useState(false)
  const [saved, setSaved] = useState(false)

  function updateField<K extends keyof SettingsValues>(
    field: K,
    value: SettingsValues[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setSaved(false)

    if (touched[field] || submitted) {
      const nextErrors = validateSettings({ ...values, [field]: value })
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }))
    }
  }

  function handleBlur(field: keyof SettingsValues) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const nextErrors = validateSettings(values)
    setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    const nextErrors = validateSettings(values)
    setErrors(nextErrors)

    if (hasErrors(nextErrors)) return

    setSaved(true)
  }

  function showError(field: keyof SettingsValues) {
    return (touched[field] || submitted) && errors[field]
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <header className="settings-form__header">
        <h1>Settings</h1>
        <p>Manage your ProjectPilot AI profile and preferences.</p>
      </header>

      <fieldset className="settings-form__section">
        <legend>Profile</legend>

        <div className="settings-form__field">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            value={values.displayName}
            aria-invalid={Boolean(showError('displayName'))}
            aria-describedby={
              showError('displayName') ? 'displayName-error' : undefined
            }
            onChange={(e) => updateField('displayName', e.target.value)}
            onBlur={() => handleBlur('displayName')}
          />
          {showError('displayName') && (
            <span id="displayName-error" className="settings-form__error" role="alert">
              {errors.displayName}
            </span>
          )}
        </div>

        <div className="settings-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={Boolean(showError('email'))}
            aria-describedby={showError('email') ? 'email-error' : undefined}
            onChange={(e) => updateField('email', e.target.value)}
            onBlur={() => handleBlur('email')}
          />
          {showError('email') && (
            <span id="email-error" className="settings-form__error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="settings-form__field">
          <label htmlFor="bio">
            Bio <span className="settings-form__optional">(optional)</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={values.bio}
            aria-invalid={Boolean(showError('bio'))}
            aria-describedby={
              showError('bio') ? 'bio-error bio-hint' : 'bio-hint'
            }
            onChange={(e) => updateField('bio', e.target.value)}
            onBlur={() => handleBlur('bio')}
          />
          <span id="bio-hint" className="settings-form__hint">
            {values.bio.length}/500 characters
          </span>
          {showError('bio') && (
            <span id="bio-error" className="settings-form__error" role="alert">
              {errors.bio}
            </span>
          )}
        </div>
      </fieldset>

      <fieldset className="settings-form__section">
        <legend>Preferences</legend>

        <div className="settings-form__field">
          <label htmlFor="timezone">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            value={values.timezone}
            aria-invalid={Boolean(showError('timezone'))}
            aria-describedby={
              showError('timezone') ? 'timezone-error' : undefined
            }
            onChange={(e) => updateField('timezone', e.target.value)}
            onBlur={() => handleBlur('timezone')}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          {showError('timezone') && (
            <span id="timezone-error" className="settings-form__error" role="alert">
              {errors.timezone}
            </span>
          )}
        </div>

        <div className="settings-form__field">
          <span className="settings-form__label">Theme</span>
          <div className="settings-form__radio-group" role="radiogroup" aria-label="Theme">
            {(['light', 'dark', 'system'] as const).map((option) => (
              <label key={option} className="settings-form__radio">
                <input
                  type="radio"
                  name="theme"
                  value={option}
                  checked={values.theme === option}
                  onChange={() => updateField('theme', option)}
                />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="settings-form__section">
        <legend>Notifications</legend>

        <label className="settings-form__checkbox">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={values.emailNotifications}
            onChange={(e) => updateField('emailNotifications', e.target.checked)}
          />
          <span>Email me when a project plan is ready</span>
        </label>

        <label className="settings-form__checkbox">
          <input
            type="checkbox"
            name="weeklyDigest"
            checked={values.weeklyDigest}
            onChange={(e) => updateField('weeklyDigest', e.target.checked)}
          />
          <span>Send a weekly progress digest</span>
        </label>
      </fieldset>

      <fieldset className="settings-form__section">
        <legend>AI Integration</legend>

        <div className="settings-form__field">
          <label htmlFor="openaiApiKey">
            OpenAI API key <span className="settings-form__optional">(optional)</span>
          </label>
          <input
            id="openaiApiKey"
            name="openaiApiKey"
            type="password"
            autoComplete="off"
            placeholder="sk-..."
            value={values.openaiApiKey}
            aria-invalid={Boolean(showError('openaiApiKey'))}
            aria-describedby={
              showError('openaiApiKey')
                ? 'openaiApiKey-error openaiApiKey-hint'
                : 'openaiApiKey-hint'
            }
            onChange={(e) => updateField('openaiApiKey', e.target.value)}
            onBlur={() => handleBlur('openaiApiKey')}
          />
          <span id="openaiApiKey-hint" className="settings-form__hint">
            Stored locally in your browser. Never shared with third parties.
          </span>
          {showError('openaiApiKey') && (
            <span
              id="openaiApiKey-error"
              className="settings-form__error"
              role="alert"
            >
              {errors.openaiApiKey}
            </span>
          )}
        </div>
      </fieldset>

      <div className="settings-form__actions">
        <button type="submit" className="settings-form__submit">
          Save settings
        </button>
        {saved && (
          <p className="settings-form__success" role="status">
            Settings saved successfully.
          </p>
        )}
      </div>
    </form>
  )
}
