export type ProjectSettingsValues = {
  projectName: string
  projectDescription: string
}

export type ProjectSettingsErrors = Partial<
  Record<keyof ProjectSettingsValues, string>
>

export const PROJECT_NAME_MIN = 3
export const PROJECT_NAME_MAX = 50
export const PROJECT_DESCRIPTION_MAX = 200

export function validateProjectSettings(
  values: ProjectSettingsValues,
): ProjectSettingsErrors {
  const errors: ProjectSettingsErrors = {}

  const trimmedName = values.projectName.trim()

  if (!trimmedName) {
    errors.projectName = 'Project name is required.'
  } else if (trimmedName.length < PROJECT_NAME_MIN) {
    errors.projectName = `Project name must be at least ${PROJECT_NAME_MIN} characters.`
  } else if (values.projectName.length > PROJECT_NAME_MAX) {
    errors.projectName = `Project name must be ${PROJECT_NAME_MAX} characters or fewer.`
  }

  if (values.projectDescription.length > PROJECT_DESCRIPTION_MAX) {
    errors.projectDescription = `Description must be ${PROJECT_DESCRIPTION_MAX} characters or fewer.`
  }

  return errors
}

export function isProjectSettingsValid(values: ProjectSettingsValues): boolean {
  return Object.keys(validateProjectSettings(values)).length === 0
}

export function clampProjectName(value: string): string {
  return value.slice(0, PROJECT_NAME_MAX)
}

export function clampProjectDescription(value: string): string {
  return value.slice(0, PROJECT_DESCRIPTION_MAX)
}
