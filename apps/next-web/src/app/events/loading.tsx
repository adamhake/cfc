import Container from "@/components/Container/container"

export default function Loading() {
  return (
    <div className="animate-pulse pb-24">
      <div className="h-64 w-full bg-grey-200 dark:bg-primary-800" />
      <Container spacing="md">
        <div className="mt-12 space-y-10">
          <div className="h-64 rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="h-64 rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="h-64 rounded-2xl bg-grey-200 dark:bg-primary-800" />
        </div>
      </Container>
    </div>
  )
}
