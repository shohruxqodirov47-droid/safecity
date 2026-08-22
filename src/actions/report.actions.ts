"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ReportSchema = z.object({
  title: z.string().min(3, "Sarlavha kamida 3 ta harfdan iborat bo'lishi kerak").max(100),
  description: z.string().min(10, "Batafsil ma'lumot kiriting (min 10 ta harf)"),
  latitude: z.number(),
  longitude: z.number(),
  image: z.string().optional(),
});

// Fallback "dummy" AI if Gemini key is missing
function fallbackSeverity(text: string) {
  const t = text.toLowerCase();
  if (t.includes("jinoyat") || t.includes("yong'in") || t.includes("qotillik") || t.includes("xavf") || t.includes("avariya")) return "CRITICAL";
  if (t.includes("janjal") || t.includes("quduq") || t.includes("kabel")) return "HIGH";
  if (t.includes("yoritkich") || t.includes("itlar") || t.includes("chuqur") || t.includes("svet")) return "MEDIUM";
  return "LOW";
}

// True AI Vision Analysis using Google Gemini
async function analyzeWithGemini(title: string, description: string, base64Image?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No GEMINI_API_KEY found, using fallback algorithm.");
    return fallbackSeverity(title + " " + description);
  }

  try {
    const prompt = `Sen shahar xavfsizligi bo'yicha ekspert AI'san. Fuqaro yuborgan ushbu hodisani tahlil qil.
    Sarlavha: "${title}"
    Izoh: "${description}"
    Agar rasm mavjud bo'lsa, uni ham diqqat bilan ko'rib chiq. 
    Vazifang: Ushbu muammoning xavflilik darajasini aniqlab, faqat bitta so'z bilan javob qaytarish. 
    Variantlar (faqat bittasini tanla): CRITICAL, HIGH, MEDIUM, LOW.
    Boshqa hech qanday izoh yozma!`;

    const parts: any[] = [{ text: prompt }];

    // If an image was uploaded, attach it to the Gemini prompt
    if (base64Image) {
      // Clean the base64 string (e.g. "data:image/jpeg;base64,...")
      const mimeType = base64Image.split(';')[0].split(':')[1];
      const base64Data = base64Image.split(',')[1];
      parts.push({
        inline_data: { mime_type: mimeType, data: base64Data }
      });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] }),
    });

    const data = await res.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.toUpperCase() || "";

    if (aiResponse.includes("CRITICAL")) return "CRITICAL";
    if (aiResponse.includes("HIGH")) return "HIGH";
    if (aiResponse.includes("MEDIUM")) return "MEDIUM";
    if (aiResponse.includes("LOW")) return "LOW";

    return "MEDIUM"; // default if AI hallucinates
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return fallbackSeverity(title + " " + description);
  }
}

export async function createReport(prevState: any, formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
      image: formData.get("image") as string | undefined,
    };

    const validated = ReportSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    // Call Gemini 1.5 Flash to analyze text AND image
    const severityLevel = await analyzeWithGemini(validated.data.title, validated.data.description, validated.data.image);

    await prisma.report.create({
      data: {
        title: validated.data.title,
        description: validated.data.description,
        latitude: validated.data.latitude,
        longitude: validated.data.longitude,
        imageUrl: validated.data.image,
        severityLevel,
      }
    });

    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create report:", error);
    return { error: "Tizim xatosi yuz berdi. Iltimos qayta urinib ko'ring." };
  }
}

export async function getReports() {
  return await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });
}

export async function upvoteReport(id: string) {
  try {
    await prisma.report.update({
      where: { id },
      data: { upvotes: { increment: 1 } }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to upvote:", error);
    return { error: "Xatolik yuz berdi" };
  }
}
