import Container from "@/components/Container/container"

export default function Loading() {
  return (
    <div className="animate-pulse space-y-24 pb-24">
      {/* Hero skeleton */}
      <div className="h-[60vh] w-full rounded-b-3xl bg-grey-200 dark:bg-primary-800" />

      {/* Intro section skeleton */}
      <Container spacing="md">
        <div className="h-8 w-3/4 rounded-lg bg-grey-200 dark:bg-primary-800" />
        <div className="mt-4 h-4 w-full max-w-4xl rounded bg-grey-200 dark:bg-primary-800" />
        <div className="mt-2 h-4 w-5/6 max-w-4xl rounded bg-grey-200 dark:bg-primary-800" />
      </Container>

      {/* Vision section skeleton */}
      <Container spacing="md">
        <div className="h-8 w-48 rounded-lg bg-grey-200 dark:bg-primary-800" />
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          <div className="h-48 rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="h-48 rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="h-48 rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="h-48 rounded-2xl bg-grey-200 dark:bg-primary-800" />
        </div>
      </Container>
    </div>
  )
}
