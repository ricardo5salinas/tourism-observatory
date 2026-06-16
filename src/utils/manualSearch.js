import { userManualSections } from '../data/userManual'

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const getSectionText = (section) =>
  normalizeText([section.title, section.keywords.join(' '), section.steps.join(' ')].join(' '))

const tokenize = (value) =>
  normalizeText(value)
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length > 2)

export const searchManual = (query, limit = 3) => {
  const terms = tokenize(query)

  if (!terms.length) {
    return []
  }

  return userManualSections
    .map((section) => {
      const sectionText = getSectionText(section)
      const titleText = normalizeText(section.title)
      const keywordText = normalizeText(section.keywords.join(' '))

      const score = terms.reduce((total, term) => {
        if (titleText.includes(term)) return total + 5
        if (keywordText.includes(term)) return total + 4
        if (sectionText.includes(term)) return total + 2
        return total
      }, 0)

      return { ...section, score }
    })
    .filter((section) => section.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export const buildManualAnswer = (query) => {
  const matches = searchManual(query)

  if (!matches.length) {
    return {
      text: 'No encontre una seccion exacta del manual para esa consulta. Prueba con palabras como usuarios, publicaciones, documentos, nucleos, autores o perfil.',
      matches: [],
    }
  }

  const [bestMatch] = matches

  return {
    text: `Segun el manual, esto corresponde a "${bestMatch.title}".`,
    matches,
  }
}
