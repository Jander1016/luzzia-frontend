import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ui/errorBoundary'
import { Loading } from '@/components/ui/loading'
import { DashboardContent } from '@/components/dashboard/layout/Content'

export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DashboardContent />
      </Suspense>
  </ErrorBoundary>
  )
}