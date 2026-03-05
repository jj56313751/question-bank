import { questionTypesMap } from '@/app/lib/constant'
import { getKeyByValue } from '@/app/lib/utils'

const questionTypes = Object.values(questionTypesMap)

/** 题型正则：匹配 "1. 单选题（0.5分）：题目" 格式 */
const QUESTION_TYPE_LINE_REG = new RegExp(
  `^(\\d+\\.)\\s*(${questionTypes.join('|')})[(（][^)）]*[)）]\\s*[：:]?\\s*(.*)$`,
  'gm',
)

export const formatDocument = (document: string): string => {
  // 1. 移除不需要的模块、统计、答题信息等
  const removeRegArray = [
    /正确题目.*共.*道题目\s*\n?/gm,
    /.*共.*题.*合计.*\n?/gm,
    /题型统计[:：].*\n?/gm,
    /回答错误.*\n?/gm,
    /回答正确.*\n?/gm,
    /得分[:：].*分.*\n?/gm,
    /你的答案[:：].*\n?/gm,
    /【你的答案】.*\n?/gm,
    /考生答案[:：].*\n?/gm,
    /.*模块[:：].*（共\d+题，合计[\d.]+分）.*\n?/gm,
    /^\.|\.$/gm,
  ]

  removeRegArray.forEach((reg) => {
    document = document.replace(reg, '')
  })

  // 2. 将 "1. 单选题（0.5分）：题目内容" 转为 "单选题\n题目内容"
  document = document.replace(
    QUESTION_TYPE_LINE_REG,
    (_, _num, type, title) => {
      const titlePart = title?.trim() ? `\n${title.trim()}` : ''
      return `${type}${titlePart}`
    },
  )

  // 3. 统一 【正确答案】XXX 和 正确答案:XXX 格式为 "正确答案\nXXX"
  document = document.replace(
    /【正确答案】\s*([^\n]*)|正确答案[:：]\s*([^\n]*)/gm,
    (_, p1, p2) => {
      const answer = (p1 || p2 || '').trim()
      return `正确答案\n${answer}`
    },
  )

  // 4. 统一 【题目解析】 格式为 "题目解析\n内容"
  document = document.replace(/【题目解析】\s*([^\n]*)?/g, (_, p1) => {
    const content = p1?.trim() ? p1.trim() : ''
    return `题目解析\n${content}`
  })

  // 5. 移除多余空行（保留单个换行作为段落分隔）
  document = document.replace(/\n{3,}/g, '\n\n')
  document = document.replace(/^\s+|\s+$/g, '')

  return document
}

export interface QuestionItem {
  type: number
  title: string
  options: string
  answer: string
  analysis: string
}

export const removeDuplicateParseToJson = (
  document: string,
): QuestionItem[] => {
  const map = new Map<string, QuestionItem>()
  let process: 1 | 2 | 3 | 4 | 5 = 1 // 1:type 2:title 3:options 4:answer 5:analysis
  let currentQuestion: QuestionItem | null = null
  /** 上一行仅为选项字母（A/B/C 等）时，下一行内容应合并到该选项 */
  let pendingOptionLetter: string | null = null

  const insertItem = (obj: QuestionItem | null) => {
    if (!obj?.type || !obj.title?.trim()) return
    const key = `${obj.type}-${obj.title.trim()}`
    if (!map.has(key)) {
      map.set(key, {
        ...obj,
        title: obj.title.trim(),
        options: obj.options.trim(),
        answer: obj.answer.trim(),
        analysis: obj.analysis.trim(),
      })
    }
  }

  const isType = (line: string) => questionTypes.includes(line.trim())
  const isAnswer = (line: string) => line.trim().startsWith('正确答案')
  const isAnalysis = (line: string) => line.trim().startsWith('题目解析')

  const isOptionLine = (line: string): boolean => {
    const t = line.trim()
    if (!t) return false
    // A-G 选项格式：Axxx、A.xxx 等
    if (/^[A-Ga-g]/.test(t)) return true
    // 判断题选项
    if (t === '正确' || t === '错误') return true
    return false
  }

  /** 是否为仅选项字母的行（如单独的 A、B、C） */
  const isOptionLetterOnly = (line: string): boolean =>
    /^[A-Ga-g]$/.test(line.trim())

  const isTitleLine = (line: string, inTitlePhase: boolean): boolean => {
    const t = line.trim()
    if (!t) return false
    if (isType(t) || isAnswer(t) || isAnalysis(t)) return false
    if (isOptionLine(t)) return false
    // 题干通常较长，或为连续题干的一部分
    return inTitlePhase || t.length >= 4
  }

  const lines = document.split(/\r\n|\n|\r/)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (process === 4) {
      pendingOptionLetter = null
      if (isAnalysis(line)) {
        process = 5
        continue
      }
      if (isType(line)) {
        insertItem(currentQuestion)
        currentQuestion = {
          type: Number(getKeyByValue(questionTypesMap, trimmed)) || 0,
          title: '',
          options: '',
          answer: '',
          analysis: '',
        }
        process = 2
      } else if (trimmed && !line.startsWith('正确答案')) {
        currentQuestion!.answer +=
          (currentQuestion!.answer ? '\n' : '') + trimmed
      }
      continue
    }

    if (process === 5) {
      pendingOptionLetter = null
      if (isType(line)) {
        insertItem(currentQuestion)
        currentQuestion = {
          type: Number(getKeyByValue(questionTypesMap, trimmed)) || 0,
          title: '',
          options: '',
          answer: '',
          analysis: '',
        }
        process = 2
      } else if (trimmed && !line.startsWith('题目解析')) {
        currentQuestion!.analysis +=
          (currentQuestion!.analysis ? '\n' : '') + trimmed
      }
      continue
    }

    if (isType(line)) {
      insertItem(currentQuestion)
      currentQuestion = {
        type: Number(getKeyByValue(questionTypesMap, trimmed)) || 0,
        title: '',
        options: '',
        answer: '',
        analysis: '',
      }
      process = 2
      continue
    }

    if (process === 2 && isTitleLine(line, true)) {
      currentQuestion!.title += (currentQuestion!.title ? '\n' : '') + trimmed
      process = 3
      continue
    }

    if (process === 3) {
      if (isAnswer(line)) {
        pendingOptionLetter = null
        process = 4
      } else if (isAnalysis(line)) {
        pendingOptionLetter = null
        process = 5
      } else if (pendingOptionLetter && trimmed && !isOptionLine(line)) {
        // 选项字母与内容分行：上一行是 A/B/C，当前行是选项内容，合并到上一选项
        const opts = currentQuestion!.options
        const endsWithLetterOnly =
          opts === pendingOptionLetter ||
          opts.endsWith('\n' + pendingOptionLetter)
        currentQuestion!.options += endsWithLetterOnly
          ? trimmed
          : '\n' + trimmed
      } else if (isOptionLine(line)) {
        if (pendingOptionLetter) {
          currentQuestion!.options += '\n' + trimmed
        } else {
          currentQuestion!.options +=
            (currentQuestion!.options ? '\n' : '') + trimmed
        }
        pendingOptionLetter = isOptionLetterOnly(line) ? trimmed : null
      } else if (isTitleLine(line, false) && trimmed) {
        // 题干可能跨多行
        pendingOptionLetter = null
        currentQuestion!.title += (currentQuestion!.title ? '\n' : '') + trimmed
      }
      continue
    }

    if (isAnswer(line)) process = 4
    else if (isAnalysis(line)) process = 5
  }

  insertItem(currentQuestion)
  return Array.from(map.values())
}

export const documentProcess = (document: string): string => {
  const cleanedDocument = formatDocument(document)
  const questions = removeDuplicateParseToJson(cleanedDocument)
  return JSON.stringify(questions, null, 2)
}
