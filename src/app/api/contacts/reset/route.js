import { NextResponse } from "next/server";
import { getContactManager } from "@/lib/dsa/ContactManager";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const manager = getContactManager();
    const contacts = manager.resetToDefaults();
    return NextResponse.json({
      success: true,
      message: "Reset to default demo contacts successfully!",
      contacts: contacts.map((c) => c.toJSON()),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset contacts" },
      { status: 500 }
    );
  }
}
