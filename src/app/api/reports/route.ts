import { NextResponse } from 'next/server';

// Removed Prisma from here completely to prevent Vercel static build errors.
// We are using Server Actions (report.actions.ts) for all database operations instead.

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export async function POST() {
  return NextResponse.json({ status: "ok" });
}
