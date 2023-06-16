
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { loginDetailsProp } from './pages/_app';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { jwtVerify} from 'jose';

const onlyLoggedInURLs = ['drafts', 'create', 'api/post', 'api/publish', 'api/upload', 'profile']
const checkToken = async (request: NextRequest) => {
  const loginCookie = request.cookies.get('loginDetails')
  if (!loginCookie)
    return false;
  const loginDetails: loginDetailsProp = JSON.parse(loginCookie.value);
  if (!loginDetails.token)
    return false;
  if (!process.env.SECRET){
    console.log("secret not set");
    return false;
  }
  try{
    const decodedToken = await jwtVerify(loginDetails.token, new TextEncoder().encode(process.env.SECRET));
    return decodedToken.payload.email === loginDetails.email;  
  }
  catch{
    return false;
  }  
}
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (request.url.includes('_next'))
    return null;

  if (onlyLoggedInURLs.some(path => request.url.includes(path))){
    if(!await checkToken(request))
      if (request.url.includes('api/'))
      return new NextResponse(
        JSON.stringify({ success: false, message: 'authentication failed' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
        )
      else
        return NextResponse.rewrite(new URL('/unauthenticated', request.url))
  }
  if (request.url.includes('login') || request.url.includes('signup')){
    if(await checkToken(request))
      return NextResponse.rewrite(new URL('/', request.url))
  }
  
  return null;
}
 
// See "Matching Paths" below to learn more
export const config = {
  api: {
    bodyParser: false,
  },
};