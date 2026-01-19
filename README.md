# P&ID Asset Extractor

> AI-powered tool to extract and verify equipment assets from P&ID(Piping & Instrumentation Diagram) PDFs or images using Claude Vision API.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎥 Demo

https://drive.google.com/file/d/1Ke0KTgAy2zuNrRFgdQDILJx3bRF_GFNQ/view?usp=sharing


## Features

- 📤 Upload P&ID diagrams (PDF / PNG / JPG)
- 🧠 AI-powered asset extraction using Claude Vision
- 🗂 Store diagrams & assets in Supabase
- 📄 View original PDF via public URL
- 🧩 Review & verify extracted assets
- ⚡ Built with Next.js App Router

## Quick Start

### Prerequisites
- Node.js 18+
- [Supabase](https://supabase.com) account
- [Anthropic API](https://console.anthropic.com) key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/pid-extractor.git
cd pid-extractor

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run database migrations
# Copy SQL from supabase/schema.sql to Supabase SQL Editor

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
ANTHROPIC_API_KEY=sk-ant-api03-your-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude 3.5 Sonnet Vision API
- **Styling**: Tailwind CSS
- **PDF**: react-pdf, pdf-img-convert
- **Validation**: Zod

## Project Flow

```
Client
  ├─ Upload file
  ├─ POST /api/upload
  │    └─ Store file + create diagram row
  ├─ Convert file → base64 (image or PDF)
  ├─ POST /api/extract
  │    ├─ Claude Vision extraction
  │    ├─ Validate output
  │    ├─ Insert assets into DB
  │    └─ Update diagram status
  └─ Navigate to /review/[diagramId]
```




