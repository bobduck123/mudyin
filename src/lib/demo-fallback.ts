export function isDbUnavailableError(error: unknown): boolean {
  const name = typeof error === 'object' && error && 'name' in error ? String((error as { name?: unknown }).name) : ''
  const message =
    typeof error === 'object' && error && 'message' in error
      ? String((error as { message?: unknown }).message)
      : String(error ?? '')

  return (
    name.includes('PrismaClientInitializationError') ||
    name.includes('PrismaClientKnownRequestError') ||
    message.includes('Can\'t reach database server') ||
    message.includes('Environment variable not found') ||
    message.includes('ECONNREFUSED') ||
    message.includes('PrismaClient is unable to run in this browser environment')
  )
}

export function demoId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10)
  return `${prefix}_${Date.now()}_${rand}`
}
