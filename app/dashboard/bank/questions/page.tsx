import React, { Suspense } from 'react'
import { Metadata } from 'next'
import SearchForm from '@/app/ui/dashboard/bank/search-form'
import { searchItems } from './config'
import QuestionsTable from '@/app/ui/dashboard/bank/questions-table'
import { fetchQuestions } from '@/app/lib/data'
import { QuestionList } from '@/app/lib/types'

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
    pageNumber: searchParams?.pageNumber,
    pageSize: searchParams?.pageSize,
  })
  const dataSource = questions.list as QuestionList[]
  const total = questions.total

  return (
    <>
      <SearchForm items={searchItems} />
      <QuestionsTable dataSource={dataSource} total={total} />
    </>
  )
}
