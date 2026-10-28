import { NextResponse } from "next/server";
import { getContactManager } from "@/lib/dsa/ContactManager";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const manager = getContactManager();
    const stats = manager.showStatistics();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get statistics" },
      { status: 500 }
    );
  }
}
