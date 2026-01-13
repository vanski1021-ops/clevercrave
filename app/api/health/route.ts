import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    checks: {
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        key_preview: process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 3)}...` : null
      },
      gemini: {
        configured: !!process.env.GEMINI_API_KEY,
        key_preview: process.env.GEMINI_API_KEY ? 'configured' : null
      }
    },
    timestamp: new Date().toISOString()
  })
}