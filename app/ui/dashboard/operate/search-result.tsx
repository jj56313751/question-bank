import { fetchQuestionsByKeyword } from '@/app/lib/data'
import type { Question } from '@/app/lib/definitions'
import { questionTypeMap } from './config'
import { Empty } from 'antd'

export default async function SearchResult({
  query,
  bankId,
}: {
  query?: string
  bankId?: number
}) {
  let currentPage = 1
  let questionList: Question[] = []
  if (query && bankId) {
    const res: any = await fetchQuestionsByKeyword({
      bankId,
      query,
      pageNumber: currentPage,
    })
    questionList = res.list
  }

  return (
    <div className="mx-auto mt-2 w-11/12">
      {questionList && questionList.length ? (
        questionList?.map((question) => (
          <div className="" key={question.id}>
            <p>{questionTypeMap[question.type]}</p>
            <p>{question.title}</p>
            <p>{question.options}</p>
            <p>正确答案：{question.answer}</p>
            <p>题目解析：{question.analysis}</p>
          </div>
        ))
      ) : (
        <Empty className="mt-10" description="暂无结果" />
      )}
    </div>
  )
}
