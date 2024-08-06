import React, { Suspense } from 'react'
import { Metadata } from 'next'
import SearchForm from '@/app/ui/dashboard/search-form'
import { searchItems } from './config'
import QuestionsTable from '@/app/ui/dashboard/bank/questions-table'
import { fetchQuestions, fetchBanks } from '@/app/lib/data'
import { QuestionList } from '@/app/lib/types'
import Title from '@/app/ui/dashboard/bank/questions-title'
import QuestionCreate from '@/app/ui/dashboard/bank/question-create'

export const metadata: Metadata = {
  title: '题目列表',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    bankId: number
    title?: string
    type?: number
    pageNumber?: number
    pageSize?: number
  }
}) {
  const questions: any = await fetchQuestions({
    bankId: searchParams?.bankId,
    title: searchParams?.title,
    type: searchParams?.type,
    pageNumber: searchParams?.pageNumber || 1,
    pageSize: searchParams?.pageSize || 10,
  })
  const dataSource = questions.list as QuestionList[]
  // console.log('[dataSource]-34', dataSource)
  const total = questions.total
  const banks: any = await fetchBanks({
    id: searchParams?.bankId,
  })
  const bankInfo = banks.list[0]

  const btns = <QuestionCreate bankId={searchParams?.bankId as number} />

  return (
    <>
      <SearchForm items={searchItems} btns={btns}>
        <Title text={bankInfo?.name} />
      </SearchForm>
      <QuestionsTable dataSource={dataSource} total={total} />
    </>
  )
}
