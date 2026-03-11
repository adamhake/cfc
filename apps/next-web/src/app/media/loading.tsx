import Container from "@/components/Container/container"

export default function Loading() {
  return (
    <div className="animate-pulse pb-24">
      <div className="h-64 w-full bg-grey-200 dark:bg-primary-800" />
      <Container spacing="md">
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="aspect-square rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="aspect-square rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="aspect-square rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="aspect-square rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="aspect-square rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="aspect-square rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="aspect-square rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="aspect-square rounded-2xl bg-grey-200 dark:bg-primary-800" />
          <div className="aspect-square rounded-2xl bg-grey-200 dark:bg-primary-800" />
        </div>
      </Container>
    </div>
  )
}
