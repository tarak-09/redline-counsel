import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const VALID_TYPES = ['msa', 'nda', 'saas', 'employment'] as const
type ContractType = (typeof VALID_TYPES)[number]

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get('file')
  const type = (req.nextUrl.searchParams.get('type') ?? 'msa') as ContractType

  if (file !== 'original' && file !== 'revised') {
    return NextResponse.json({ error: 'Invalid file param' }, { status: 400 })
  }
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid type param' }, { status: 400 })
  }

  try {
    const filePath = join(process.cwd(), 'packages', 'sample-data', `${file}_${type}.txt`)
    const content = readFileSync(filePath, 'utf-8')
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
