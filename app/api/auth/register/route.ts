import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVISCORE_API || 'https://serviscore-nest-production.up.railway.app'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('[API Proxy] Register request to:', `${BACKEND_URL}/auth/register`)
    
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json().catch(() => ({}))
    
    if (!response.ok) {
      console.error('[API Proxy] Register error:', response.status, data)
      return NextResponse.json(
        { message: data.message || 'Registration failed', error: data },
        { status: response.status }
      )
    }
    
    console.log('[API Proxy] Register success')
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[API Proxy] Register exception:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
