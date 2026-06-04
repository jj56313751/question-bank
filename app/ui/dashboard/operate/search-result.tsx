import { fetchQuestionsByVectorSearch } from '@/app/lib/data'
import type { QuestionWithScore } from '@/app/lib/data'
import { questionTypesMap } from '@/app/lib/constant'
import { Empty, Card, Tag } from 'antd'

export default async function SearchResult({
  title,
  bankId,
}: {
  title?: string
  bankId?: number
}) {
  let questionList: QuestionWithScore[] = []
  let searchMode: 'vector' | 'keyword' | null = null
  if (title && bankId) {
    const res = await fetchQuestionsByVectorSearch({
      bankId,
      title,
      pageNumber: 1,
      pageSize: 20,
    })
    questionList = res.list
    searchMode = res.searchMode
  }

  return (
    <div className="mx-auto mt-2 w-11/12">
      {searchMode === 'keyword' ? (
        <p className="mb-3 text-sm text-gray-500">
          未找到语义相关题目，已改用题库关键词匹配
        </p>
      ) : null}
      {questionList && questionList.length ? (
        questionList?.map((question) => (
          <Card
            key={question.id}
            className="!mb-4"
            title={
              <span className="flex items-center gap-2">
                {questionTypesMap[String(question.type)]}
                {question.score !== undefined ? (
                  <Tag color="blue">
                    相关度 {Math.round(question.score * 100)}%
                  </Tag>
                ) : null}
              </span>
            }
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
