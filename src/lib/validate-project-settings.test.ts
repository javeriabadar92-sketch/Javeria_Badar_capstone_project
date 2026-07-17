import { describe, expect, it } from 'vitest'
import {
  clampProjectDescription,
  clampProjectName,
  isProjectSettingsValid,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_NAME_MAX,
  PROJECT_NAME_MIN,
  validateProjectSettings,
} from './validate-project-settings'

describe('validateProjectSettings', () => {
  it('returns no errors for valid input', () => {
    const errors = validateProjectSettings({
      projectName: 'TaskFlow App',
      projectDescription: 'A task manager for students.',
    })
    expect(errors).toEqual({})
    expect(isProjectSettingsValid({ projectName: 'TaskFlow App', projectDescription: '' })).toBe(true)
  })

  it('requires project name', () => {
    expect(validateProjectSettings({ projectName: '', projectDescription: '' }).projectName).toBe(
      'Project name is required.',
    )
  })

  it('rejects whitespace-only project name', () => {
    expect(
      validateProjectSettings({ projectName: '   ', projectDescription: '' }).projectName,
    ).toBe('Project name is required.')
  })

  it('enforces minimum name length after trimming', () => {
    expect(
      validateProjectSettings({ projectName: 'ab', projectDescription: '' }).projectName,
    ).toBe(`Project name must be at least ${PROJECT_NAME_MIN} characters.`)

    expect(
      validateProjectSettings({ projectName: '  ab  ', projectDescription: '' }).projectName,
    ).toBe(`Project name must be at least ${PROJECT_NAME_MIN} characters.`)
  })

  it('accepts name at exactly minimum length', () => {
    const name = 'a'.repeat(PROJECT_NAME_MIN)
    expect(validateProjectSettings({ projectName: name, projectDescription: '' })).toEqual({})
  })

  it('rejects name past maximum length', () => {
    const name = 'a'.repeat(PROJECT_NAME_MAX + 1)
    expect(
      validateProjectSettings({ projectName: name, projectDescription: '' }).projectName,
    ).toBe(`Project name must be ${PROJECT_NAME_MAX} characters or fewer.`)
  })

  it('accepts name at exactly maximum length', () => {
    const name = 'a'.repeat(PROJECT_NAME_MAX)
    expect(validateProjectSettings({ projectName: name, projectDescription: '' })).toEqual({})
  })

  it('allows empty description', () => {
    expect(
      validateProjectSettings({ projectName: 'Valid Name', projectDescription: '' }),
    ).toEqual({})
  })

  it('accepts description at exactly maximum length', () => {
    const description = 'd'.repeat(PROJECT_DESCRIPTION_MAX)
    expect(
      validateProjectSettings({ projectName: 'Valid Name', projectDescription: description }),
    ).toEqual({})
  })

  it('rejects description past maximum length', () => {
    const description = 'd'.repeat(PROJECT_DESCRIPTION_MAX + 1)
    expect(
      validateProjectSettings({ projectName: 'Valid Name', projectDescription: description })
        .projectDescription,
    ).toBe(`Description must be ${PROJECT_DESCRIPTION_MAX} characters or fewer.`)
  })
})

describe('clamp helpers', () => {
  it('clamps project name to max length', () => {
    const long = 'n'.repeat(PROJECT_NAME_MAX + 10)
    expect(clampProjectName(long).length).toBe(PROJECT_NAME_MAX)
  })

  it('clamps project description to max length', () => {
    const long = 'd'.repeat(PROJECT_DESCRIPTION_MAX + 50)
    expect(clampProjectDescription(long).length).toBe(PROJECT_DESCRIPTION_MAX)
  })
})

describe('isProjectSettingsValid', () => {
  it('returns false when any field is invalid', () => {
    expect(isProjectSettingsValid({ projectName: '', projectDescription: '' })).toBe(false)
    expect(
      isProjectSettingsValid({
        projectName: 'Valid',
        projectDescription: 'x'.repeat(PROJECT_DESCRIPTION_MAX + 1),
      }),
    ).toBe(false)
  })
})
