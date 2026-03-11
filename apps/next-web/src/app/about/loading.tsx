import Container from "@/components/Container/container"

export default function Loading() {
  return (
    <div className="animate-pulse pb-24">
      <div className="h-64 w-full bg-grey-200 dark:bg-primary-800" />
      <Container spacing="md">
        <div className="mt-8 space-y-4">
          <div className="h-8 w-1/2 rounded-lg bg-grey-200 dark:bg-primary-800" />
          <div className="h-4 w-full rounded bg-grey-200 dark:bg-primary-800" />
          <div className="h-4 w-5/6 rounded bg-grey-200 dark:bg-primary-800" />
          <div className="h-4 w-4/5 rounded bg-grey-200 dark:bg-primary-800" />
        </div>
      </Container>
    </div>
  )
}
