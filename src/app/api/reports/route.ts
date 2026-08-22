import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// A simple mock AI function to determine severity
function analyzeSeverity(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('jinoyat') || lower.includes('qurol') || lower.includes('yong\'in') || lower.includes('xavfli')) {
    return 'High';
  } else if (lower.includes('it') || lower.includes('yoritkich yo\'q') || lower.includes('shubhali')) {
    return 'Medium';
  }
  return 'Low';
}

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, latitude, longitude } = body;

    const severityLevel = analyzeSeverity(title + " " + description);

    const report = await prisma.report.create({
      data: {
        title,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        severityLevel,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
