import { fetchQuestions } from '@/app/lib/data'
import type { Question } from '@/app/lib/definitions'
import { questionTypesMap } from '@/app/lib/constant'
import { Empty } from 'antd'

export default async function SearchResult({
  title,
  bankId,
}: {
  title?: string
  bankId?: number
}) {
  let currentPage = 1
  let questionList: Question[] = []
  if (title && bankId) {
    const res: any = await fetchQuestions({
      bankId,
      title,
      pageNumber: currentPage,
    })
    questionList = res.list
  }

  return (
    <div className="mx-auto mt-2 w-11/12">
      {questionList && questionList.length ? (
        questionList?.map((question) => (
          <div className="" key={question.id}>
            <p>{questionTypesMap[String(question.type)]}</p>
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
