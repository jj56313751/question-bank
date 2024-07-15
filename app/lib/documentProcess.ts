import { questionTypesMap } from '@/app/lib/constant'
import { getKeyByValue } from '@/app/lib/utils'

const questionTypes = Object.values(questionTypesMap)

export const formatDocument = (document: string): string => {
  const removeRegArray = [
    // RegExp(
    //   `^(${questionTypes.join('|')}).*`,
    //   'gm',
    // ) /* XX题（共XX题，合计X.X分） */,
    /正确题目.*共.*道题目\n/gm /* 正确题目题XX共XX道题目 */,
    /回答错误.*\n/gm,
    /回答正确.*\n/gm,
    /得分.*分.*\n/gm /* 得分：XX分 */,
    /你的答案.*\n/gm /* 你的答案：XX */,
    /考生答案.*\n/gm /* 考生答案：XX */,
    /^\.|\.$/gm /* start with . */,
    // /^\s*$(?:\r\n?|\n)/gm /* blank row */,
  ]

  removeRegArray.forEach((reg, index) => {
    document = document.replace(reg, '')
  })

  // // const reg1 = /.*题[（(]共\d+题[,，]合计\d+(\.\d+)?分[）)].*\n/g

  /* XX题（XX分） => XX题 */
  const typeReg = RegExp(`.*(${questionTypes.join('|')})[(（].*[)）].*`, 'g')
  document = document.replace(typeReg, '$1')

  /* wrap with 正确答案 and answer */
  const answerReg =
    /.*【正确答案】([^\n]+)|.*正确答案[:：]([^\n]+)/gm /* 【正确答案】XXX | 正确答案:XXX */
  document = document.replace(answerReg, (match, p1, p2) => {
    if (p1) return `正确答案\n${p1}`
    if (p2) return `正确答案\n${p2}`
    return match
  })

  /* 【题目解析】 => 题目解析 */
  const symbolAnalizeReg = /.*【题目解析】(.*)?/g /*【题目解析】 */
  document = document.replace(symbolAnalizeReg, (match, p1) => {
    if (p1 && p1.trim()) {
      return '题目解析\n' + p1.trim()
    }
    return '题目解析'
  })

  document = document.replace(/^\s*$(?:\r\n?|\n)/gm, '')
  return document
}

export const removeDuplicateParseToJson = (document: string): any[] => {
  let map = new Map()
  /* 
    1: type 
    2: title 
    3: options 
    4: answer 
    5: analysis 
  */
  let process: number = 1
  let currentQuestion: QuestionItem | null = null

  function insertItem(obj: QuestionItem) {
    const key = `${obj.type}-${obj.title}`
    if (!map.has(key)) {
      map.set(key, obj)
    }
  }

  function isType(line: string) {
    return questionTypes.includes(line)
  }

  function isOptions(line: string) {
    const optionsStartPattern = /^[A-Ga-g]/

    return optionsStartPattern.test(line) || line.length <= 2
  }

  function isAnswer(line: string) {
    return line.startsWith('正确答案')
  }

  function isAnalysis(line: string) {
    return line.startsWith('题目解析')
  }

  function notTypeOrOptions(line: string) {
    return (
      line.length >= 6 && // not 正确，错误，对错 and question type
      !line.includes('正确答案') &&
      !line.includes('题目解析') &&
      !isOptions(line) // not A-G and a-g
    )
  }

  const lines = document.split(/\r\n|\n|\r/)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (process === 4) {
      if (isAnalysis(line)) {
        process = 5
        continue
      } else if (isType(line)) {
        process = 1
      } else {
        ;(currentQuestion as QuestionItem).answer += line + '\n'
        continue
      }
    } else if (process === 5) {
      if (isType(line)) {
        process = 1
      } else {
        ;(currentQuestion as QuestionItem).analysis += line + '\n'
        continue
      }
    }

    if (isType(line)) {
      currentQuestion !== null &&
        currentQuestion.type &&
        currentQuestion.title &&
        insertItem(currentQuestion)
      currentQuestion = new QuestionItem({})
      currentQuestion.type = Number(getKeyByValue(questionTypesMap, line))
      process = 2
    } else if (notTypeOrOptions(line) && process === 2) {
      ;(currentQuestion as QuestionItem).title += line + '\n'
      process = 3
    } else if (isOptions(line) && process === 3) {
      ;(currentQuestion as QuestionItem).options += line + '\n'
    } else if (isAnswer(line)) {
      process = 4
    } else if (isAnalysis(line)) {
      process = 5
    }

    if (i === lines.length - 1) {
      insertItem(currentQuestion as QuestionItem)
    }
  }

  return Array.from(map.values())
}

class QuestionItem {
  type: number
  title: string | null
  options: string | null
  answer: string | null
  analysis: string | null

  constructor({
    type,
    title,
    options,
    answer,
    analysis,
  }: {
    type?: number
    title?: string
    options?: string
    answer?: string
    analysis?: string
  }) {
    this.type = type || 0
    this.title = title || null
    this.options = options || null
    this.answer = answer || null
    this.analysis = analysis || null
  }
}

export const documentProcess = (document: string) => {
  const cleanedDocument = formatDocument(document)

  const documentJsonString = JSON.stringify(
    removeDuplicateParseToJson(cleanedDocument),
  )

  return documentJsonString
}
