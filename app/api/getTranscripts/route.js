import { NextResponse } from 'next/server';
import ytDlp  from 'yt-dlp-exec';
import path from 'path';

export async function POST(request) {
  const { videoUrl } = await request.json();
  if (!videoUrl) {
    return NextResponse.json({ error: 'Missing videoUrl' }, { status: 400 });
  }

  try {
    const binaryPath = path.join(process.cwd(), 'node_modules', 'yt-dlp-exec', 'bin', 'yt-dlp.exe');

    const result = await ytDlp(videoUrl, {
      dumpSingleJson: true,
      skipDownload: true,
      writeSubs: true,
      subLang: 'en',
      subFormat: 'srt',
      binaryPath 
    });

    return NextResponse.json({ subtitles: result.subtitles }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
