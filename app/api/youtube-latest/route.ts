import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.youtube.com/@Saintontas/videos', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return NextResponse.json({ videoId: 'N-5rOF_j9nI' });
    }
    
    const html = await response.text();
    const match = html.match(/"videoId":"([a-zA-Z0-9_\-]+)"/);
    
    if (match && match[1]) {
      return NextResponse.json({ videoId: match[1] });
    } else {
      // Fallback ID if nothing is found
      return NextResponse.json({ videoId: 'N-5rOF_j9nI' });
    }
  } catch (error) {
    console.error('Error fetching latest video:', error);
    return NextResponse.json({ videoId: 'N-5rOF_j9nI' });
  }
}
