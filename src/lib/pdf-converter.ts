import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import { createCanvas } from 'canvas'

export async function convertPdfToImage(pdfBuffer: Buffer): Promise<{ base64: string; mimeType: string }> {
  try {
    console.log('Starting PDF conversion, buffer size:', pdfBuffer.length)
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
      verbosity: 0, // Reduce console spam
    })
    
    const pdf = await loadingTask.promise
    console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`)
    
    // Get first page
    const page = await pdf.getPage(1)
    console.log('First page retrieved')
    
    // Set scale for high quality (2.0 = 200% of original size)
    const scale = 2.0
    const viewport = page.getViewport({ scale })
    
    console.log(`Viewport dimensions: ${viewport.width} x ${viewport.height}`)
    
    // Create canvas with the viewport dimensions
    const canvas = createCanvas(viewport.width, viewport.height)
    const context = canvas.getContext('2d')
    
    // Set white background (PDFs might be transparent)
    context.fillStyle = 'white'
    context.fillRect(0, 0, viewport.width, viewport.height)
    
    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context as any,
      viewport: viewport,
    }
    
    console.log('Rendering PDF page to canvas...')
    await page.render(renderContext).promise
    console.log('PDF page rendered successfully')
    
    // Convert canvas to PNG buffer, then to base64
    const pngBuffer = canvas.toBuffer('image/png')
    const base64 = pngBuffer.toString('base64')
    
    console.log(`Conversion complete. Base64 length: ${base64.length}`)
    
    // Cleanup
    await pdf.destroy()
    
    return {
      base64,
      mimeType: 'image/png'
    }
    
  } catch (error) {
    console.error('PDF conversion error:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to convert PDF to image: ${error.message}`)
    }
    throw new Error('Failed to convert PDF to image: Unknown error')
  }
}