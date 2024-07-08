import LoginForm from '@/app/ui/login-form'
import { Metadata } from 'next'
import Image from 'next/image'
import { Flex } from 'antd'

export const metadata: Metadata = {
  title: 'Login',
}

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <Flex
          align="center"
          justify="center"
          className="md:h-30 h-20 w-full rounded-lg p-3"
        >
          <Image src="/logo.png" width={60} height={60} alt="Question Bank" />
          <p className="ml-2 text-3xl">Question Bank</p>
        </Flex>
        <LoginForm />
      </div>
    </main>
  )
}
