import { NextResponse } from "next/server";

export async function GET() {
  // We check both in case you named it differently in Cloud Run
  return NextResponse.json({
    mapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "",
  });
}
