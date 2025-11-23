// Type declarations for CSS module import
declare module "*.css" {
  const content: Record<string, string>
  export default content
}
