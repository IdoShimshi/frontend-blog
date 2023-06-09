
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log(`Request URL: ${request.url}`);
  console.log(`HTTP Method: ${request.method}`);
  return null;
}
 
// See "Matching Paths" below to learn more
export const config = {
  api: {
    bodyParser: false,
  },
};