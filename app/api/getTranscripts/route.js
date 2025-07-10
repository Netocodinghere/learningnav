import { NextResponse } from 'next/server';
import * as ytVideo from '@hydralerne/youtube-api';
import path from 'path';

export async function POST(request) {

    const { videoUrl } = await request.json();
    const {getData}=ytVideo;
  if (!videoUrl) {
    return NextResponse.json({ error: 'Missing videoUrl' }, { status: 400 });
  }

  try {

    const result = await getData(videoUrl);

    return NextResponse.json({ subtitles: result}, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
