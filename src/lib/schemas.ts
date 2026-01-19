import { z } from 'zod'

export const AssetSchema = z.object({
  tag: z.string().min(1, 'Tag is required'),
  type: z.string().min(1, 'Type is required'),
  coordinates: z.array(z.number()).length(2, 'Coordinates must be [x, y]')
})

export const AssetsResponseSchema = z.object({
  assets: z.array(AssetSchema)
})

export type Asset = z.infer<typeof AssetSchema>
export type AssetsResponse = z.infer<typeof AssetsResponseSchema>