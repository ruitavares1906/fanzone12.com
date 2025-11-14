declare module 'next/server' {
  export interface NextRequest extends Request {
    json(): Promise<any>
  }
  
  export class NextResponse {
    static json(data: any, init?: ResponseInit): NextResponse
  }
}
