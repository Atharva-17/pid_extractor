export interface Diagram {
  id: string
  user_id: string
  filename: string
  storage_path: string
  public_url: string | null
  status: 'pending' | 'processing' | 'completed' | 'error'
  created_at: string
  updated_at: string
}

export interface Asset {
  id: string
  diagram_id: string
  tag: string
  type: string
  coordinates: [number, number]
  verified: boolean
  created_at: string
  updated_at: string
}