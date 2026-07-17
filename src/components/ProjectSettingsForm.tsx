import { useMemo, useState, type FormEvent } from 'react'
import {
  clampProjectDescription,
  clampProjectName,
  isProjectSettingsValid,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_NAME_MAX,
  PROJECT_NAME_MIN,
  validateProjectSettings,
  type ProjectSettingsValues,
} from '../lib/validate-project-settings'
import './ProjectSettingsForm.css'

const DEFAULT_VALUES: ProjectSettingsValues = {
  projectName: '',
  projectDescription: '',
}

type TouchedFields = Partial<Record<keyof ProjectSettingsValues, boolean>>

function ErrorMessage({ id, message }: { id: string; message: string }) {
  return (
    <span id={id} className="project-settings-form__error" role="alert">
      <svg
        className="project-settings-form__error-icon"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
        <path
          d="M8 4.5v4M8 11h.01"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {message}
    </span>
  )
}

export default function ProjectSettingsForm() {
  const [values, setValues] = useState<ProjectSettingsValues>(DEFAULT_VALUES)
  const [touched, setTouched] = useState<TouchedFields>({})
  const [submitted, setSubmitted] = useState(false)
  const [saved, setSaved] = useState(false)

  const errors = useMemo(() => validateProjectSettings(values), [values])
  const isValid = useMemo(() => isProjectSettingsValid(values), [values])

  function showError(field: keyof ProjectSettingsValues) {
    return (touched[field] || submitted) && errors[field]
  }

  function updateProjectName(raw: string) {
    setSaved(false)
    setValues((prev) => ({ ...prev, projectName: clampProjectName(raw) }))
  }

  function updateProjectDescription(raw: string) {
    setSaved(false)
    setValues((prev) => ({
      ...prev,
      projectDescription: clampProjectDescription(raw),
    }))
  }

  function handleBlur(field: keyof ProjectSettingsValues) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    setTouched({ projectName: true, projectDescription: true })

    if (!isValid) return

    setSaved(true)
  }

  return (
    <form
      className="project-settings-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <header className="project-settings-form__header">
        <div className="project-settings-form__badge">Project Setup</div>
        <h1>Project Settings</h1>
        <p>Tell us about your project before you start planning.</p>
      </header>

      <div className="project-settings-form__card">
        <div className="project-settings-form__field">
          <label htmlFor="projectName">Project Name</label>
          <input
            id="projectName"
            name="projectName"
            type="text"
            value={values.projectName}
            maxLength={PROJECT_NAME_MAX}
            placeholder="e.g. TaskFlow App"
            aria-invalid={Boolean(showError('projectName'))}
            aria-describedby={
              showError('projectName')
                ? 'projectName-error projectName-hint'
                : 'projectName-hint'
            }
            onChange={(e) => updateProjectName(e.target.value)}
            onBlur={() => handleBlur('projectName')}
            onPaste={(e) => {
              e.preventDefault()
              const pasted = e.clipboardData.getData('text')
              const input = e.currentTarget
              const start = input.selectionStart ?? values.projectName.length
              const end = input.selectionEnd ?? values.projectName.length
              const next =
                values.projectName.slice(0, start) +
                pasted +
                values.projectName.slice(end)
              updateProjectName(next)
            }}
          />
          <span id="projectName-hint" className="project-settings-form__hint">
            {values.projectName.length}/{PROJECT_NAME_MAX} characters · min{' '}
            {PROJECT_NAME_MIN}
          </span>
          {showError('projectName') && (
            <ErrorMessage id="projectName-error" message={errors.projectName!} />
          )}
        </div>

        <div className="project-settings-form__field">
          <label htmlFor="projectDescription">
            Project Description{' '}
            <span className="project-settings-form__optional">(optional)</span>
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            rows={4}
            value={values.projectDescription}
            maxLength={PROJECT_DESCRIPTION_MAX}
            placeholder="What are you building? Who is it for?"
            aria-invalid={Boolean(showError('projectDescription'))}
            aria-describedby={
              showError('projectDescription')
                ? 'projectDescription-error projectDescription-hint'
                : 'projectDescription-hint'
            }
            onChange={(e) => updateProjectDescription(e.target.value)}
            onBlur={() => handleBlur('projectDescription')}
            onPaste={(e) => {
              e.preventDefault()
              const pasted = e.clipboardData.getData('text')
              const textarea = e.currentTarget
              const start = textarea.selectionStart ?? values.projectDescription.length
              const end = textarea.selectionEnd ?? values.projectDescription.length
              const next =
                values.projectDescription.slice(0, start) +
                pasted +
                values.projectDescription.slice(end)
              updateProjectDescription(next)
            }}
          />
          <span
            id="projectDescription-hint"
            className="project-settings-form__hint"
          >
            {values.projectDescription.length}/{PROJECT_DESCRIPTION_MAX}{' '}
            characters
          </span>
          {showError('projectDescription') && (
            <ErrorMessage
              id="projectDescription-error"
              message={errors.projectDescription!}
            />
          )}
        </div>
      </div>

      <div className="project-settings-form__actions">
        <button
          type="submit"
          className="project-settings-form__submit"
          disabled={!isValid}
        >
          Save Project Settings
        </button>
        {saved && (
          <p className="project-settings-form__success" role="status">
            Project settings saved locally.
          </p>
        )}
      </div>
    </form>
  )
}
