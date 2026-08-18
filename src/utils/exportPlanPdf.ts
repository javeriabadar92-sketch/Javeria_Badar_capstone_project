import { jsPDF } from 'jspdf'
import type { ProjectPlan } from '../context/PlanContext'

const MARGIN = 20
const PAGE_WIDTH = 210
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const LINE_HEIGHT = 7

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, fontSize = 11): number {
  doc.setFontSize(fontSize)
  const lines = doc.splitTextToSize(text, maxWidth) as string[]
  doc.text(lines, x, y)
  return y + lines.length * (fontSize * 0.45) + 4
}

function checkPageBreak(doc: jsPDF, y: number, needed = 20): number {
  if (y + needed > 280) {
    doc.addPage()
    return MARGIN
  }
  return y
}

export function exportPlanPdf(plan: ProjectPlan, title?: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = MARGIN

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(30, 41, 59)
  doc.text(title || 'Project Plan', MARGIN, y)
  y += 12

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  y = addWrappedText(doc, `Project idea: ${plan.projectIdea}`, MARGIN, y, CONTENT_WIDTH, 10)
  y += 6

  const section = (heading: string) => {
    y = checkPageBreak(doc, y, 16)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(79, 70, 229)
    doc.text(heading, MARGIN, y)
    y += 10
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 41, 59)
  }

  const bulletList = (items: string[]) => {
    for (const item of items) {
      y = checkPageBreak(doc, y, 12)
      doc.setFontSize(11)
      const lines = doc.splitTextToSize(`• ${item}`, CONTENT_WIDTH - 6) as string[]
      doc.text(lines, MARGIN + 4, y)
      y += lines.length * LINE_HEIGHT + 2
    }
    y += 4
  }

  section('Overview')
  y = addWrappedText(doc, plan.overview, MARGIN, y, CONTENT_WIDTH)

  section('Functional Requirements')
  bulletList(plan.requirements.functional)

  section('Non-Functional Requirements')
  bulletList(plan.requirements.nonFunctional)

  section('User Stories')
  bulletList(plan.userStories)

  section('Suggested Features')
  bulletList(plan.suggestedFeatures)

  section('Roadmap')
  for (const item of plan.roadmap) {
    y = checkPageBreak(doc, y, 16)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(item.phase, MARGIN, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    y = addWrappedText(doc, item.description, MARGIN + 4, y, CONTENT_WIDTH - 4, 10)
    y += 2
  }

  const filename = (title || 'project-plan').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  doc.save(`${filename}.pdf`)
}
