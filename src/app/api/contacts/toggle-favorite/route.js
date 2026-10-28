import { NextResponse } from "next/server";
import { getContactManager } from "@/lib/dsa/ContactManager";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const manager = getContactManager();
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number required" },
        { status: 400 }
      );
    }

    const updated = manager.toggleFavorite(phone);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      contact: updated.toJSON(),
      favorite: updated.getFavorite(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}
