import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userId = formData.get('userId') as string

    console.log(userId)

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Generate server-side UUID
    const diagramId = uuidv4()

    // Storage path (anonymous uploads)
    const path = `anonymous/${diagramId}_${file.name}`
    const bytes = await file.arrayBuffer()

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('pid-diagrams')
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pid-diagrams')
      .getPublicUrl(path)

    // Insert diagram row (RLS bypassed safely)
    const { error: dbError } = await supabase
      .from('diagrams')
      .insert({
        id: diagramId,
        user_id: userId,              // ✅ anonymous
        filename: file.name,
        storage_path: path,
        public_url: publicUrl,
        status: 'pending'
      })

    if (dbError) {
      console.error('DB insert error:', dbError)
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { diagramId },
      { status: 200 }
    )

  } catch (error) {
    console.error('Upload route error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unexpected upload error'
      },
      { status: 500 }
    )
  }
}
