import { fetchQuestions } from '@/app/lib/data'
import type { Question } from '@/app/lib/definitions'
import { questionTypesMap } from '@/app/lib/constant'
import { Empty, Card, Tag } from 'antd'

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
          <Card
            key={question.id}
            className="!mb-4"
            title={questionTypesMap[String(question.type)]}
          >
            <p className="mb-2 text-base">{question.title}</p>
            {question.options &&
              question.options.split('\n').map((option, oi) => (
                <p className="leading-6" key={oi}>
                  {option}
                </p>
              ))}
            <p className="my-2">
              <Tag bordered={false} color="success">
                正确答案
              </Tag>
              {question.answer}
            </p>
            <p>
              <Tag bordered={false} color="orange">
                题目解析
              </Tag>
              {question.analysis}
            </p>
          </Card>
        ))
      ) : (
        <Empty className="mt-10" description="暂无结果" />
      )}
    </div>
  )
}
