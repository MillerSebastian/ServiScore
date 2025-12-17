import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVISCORE_API || 'https://serviscore-nest-production.up.railway.app'

async function proxyRequest(request: NextRequest, path: string) {
  try {
    const url = `${BACKEND_URL}/${path}`
    const contentType = request.headers.get('Content-Type') || ''
    
    // Get headers from the original request
    const headers: Record<string, string> = {}
    
    // Forward authorization header if present
    const authHeader = request.headers.get('Authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    // Build fetch options
    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    }
    
    // Add body for non-GET requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      // Check if it's a multipart/form-data request (file upload)
      if (contentType.includes('multipart/form-data')) {
        // Forward the raw body and content-type header for multipart requests
        headers['Content-Type'] = contentType
        fetchOptions.body = await request.arrayBuffer()
        console.log(`[API Proxy] Forwarding multipart request, body size: ${(fetchOptions.body as ArrayBuffer).byteLength}`)
      } else {
        // Handle JSON body
        try {
          const body = await request.json()
          fetchOptions.body = JSON.stringify(body)
          headers['Content-Type'] = 'application/json'
        } catch {
          // No body or invalid JSON, continue without body
        }
      }
    }
    
    console.log(`[API Proxy] ${request.method} ${url}`)
    
    const response = await fetch(url, fetchOptions)
    console.log(`[API Proxy] Response status: ${response.status}`)
    const data = await response.json().catch(() => ({}))
    
    if (!response.ok) {
      console.error(`[API Proxy] Error ${response.status}:`, data)
      return NextResponse.json(data, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[API Proxy] Exception:', error)
    return NextResponse.json(
      { message: error.message || 'Proxy error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}
