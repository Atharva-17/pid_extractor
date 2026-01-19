// import { NextRequest, NextResponse } from 'next/server'
// import { extractAssetsFromPID } from '@/lib/anthropic'
// import { AssetsResponseSchema } from '@/lib/schemas'

// export async function POST(request: NextRequest) {
//   try {
//     const { base64, mimeType } = await request.json()

//     if (!base64 || !mimeType) {
//       return NextResponse.json(
//         { error: 'Missing base64 or mimeType' },
//         { status: 400 }
//       )
//     }

//     const result = await extractAssetsFromPID(base64, mimeType)
//     const validated = AssetsResponseSchema.parse(result)

//     return NextResponse.json(validated)
//   } catch (error) {
//     console.error('Extraction error:', error)
//     return NextResponse.json(
//       { error: 'Extraction failed' },
//       { status: 500 }
//     )
//   }
// }

// export const runtime = 'nodejs'




import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { extractAssetsFromPID } from '@/lib/anthropic'
import { AssetsResponseSchema } from '@/lib/schemas'

export async function POST(request: NextRequest) {
  try {
    const { base64, mimeType, diagramId } = await request.json()

    if (!base64 || !mimeType || !diagramId) {
      return NextResponse.json(
        { error: 'base64, mimeType and diagramId are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    /* ==========================
       1️⃣ EXTRACT WITH CLAUDE
    ========================== */
    const result = await extractAssetsFromPID(base64, mimeType)
    const validated = AssetsResponseSchema.parse(result)

    if (!validated.assets || validated.assets.length === 0) {
      // Update diagram even if no assets
      await supabase
        .from('diagrams')
        .update({ status: 'completed' })
        .eq('id', diagramId)

      return NextResponse.json({ assets: [], inserted: 0 })
    }

    /* ==========================
       2️⃣ INSERT ASSETS
    ========================== */
    const rows = validated.assets.map(asset => ({
      diagram_id: diagramId,
      tag: asset.tag,
      type: asset.type,
      coordinates: asset.coordinates,
      verified: false
    }))

    const { error: insertError } = await supabase
      .from('assets')
      .insert(rows)

    if (insertError) {
      console.error('Assets insert error:', insertError)
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    /* ==========================
       3️⃣ UPDATE DIAGRAM STATUS
    ========================== */
    await supabase
      .from('diagrams')
      .update({ status: 'completed' })
      .eq('id', diagramId)

    return NextResponse.json(
      {
        assets: validated.assets,
        inserted: rows.length
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Extract route error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unexpected extract error'
      },
      { status: 500 }
    )
  }
}

