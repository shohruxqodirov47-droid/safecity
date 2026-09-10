"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";

const CATEGORIES = ["YOL", "CHIROQ", "QUVUR", "XAVFSIZLIK", "IFLOSLIK", "BOSHQA"] as const;

const ReportSchema = z.object({
  title: z.string().trim().min(3, "Sarlavha kamida 3 ta harfdan iborat bo'lishi kerak").max(100),
  description: z.string().trim().min(10, "Batafsil ma'lumot kiriting (min 10 ta harf)").max(3000),
  latitude: z.number().finite(),
  longitude: z.number().finite(),
  image: z.string().optional(),
  severityLevel: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  category: z.enum(CATEGORIES),
});

export async function createReport(prevState: any, formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
      image: (formData.get("image") as string) || undefined,
      severityLevel: formData.get("severityLevel") as string,
      category: (formData.get("category") as string) || "BOSHQA",
    };

    const validated = ReportSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    await prisma.report.create({
      data: {
        title: validated.data.title,
        description: validated.data.description,
        category: validated.data.category,
        latitude: validated.data.latitude,
        longitude: validated.data.longitude,
        imageUrl: validated.data.image,
        severityLevel: validated.data.severityLevel,
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
  try {
    return await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  } catch (error) {
    console.error("Failed to get reports:", error);
    return [];
  }
}

export async function upvoteReport(id: string) {
  if (!id || typeof id !== "string") {
    return { error: "Noto'g'ri ID" };
  }
  try {
    await prisma.report.update({
      where: { id },
      data: { upvotes: { increment: 1 } }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to upvote:", error);
    return { error: "Ovoz berishda xatolik yuz berdi. Iltimos qayta urinib ko'ring." };
  }
}
