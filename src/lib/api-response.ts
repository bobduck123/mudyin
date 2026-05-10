import { NextResponse } from 'next/server'

export type ApiErrorCode =
  | 'bad_request'
  | 'configuration_error'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'server_error'
  | 'unauthorized'
  | 'unknown_host'

export function jsonError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    { status },
  )
}

