import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    mapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "",
    firebase: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "",
    }
  });
}
