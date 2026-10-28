import { NextResponse } from "next/server";
import { getContactManager } from "@/lib/dsa/ContactManager";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/**
 * GET: Returns raw contacts.txt content
 */
export async function GET() {
  try {
    const manager = getContactManager();
    // Ensure synced
    manager.saveToFile();

    let raw = "";
    if (fs.existsSync(manager.primaryFilePath)) {
      raw = fs.readFileSync(manager.primaryFilePath, "utf8");
    }

    return new Response(raw, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": 'attachment; filename="contacts.txt"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to read contacts.txt" },
      { status: 500 }
    );
  }
}

/**
 * POST: Replaces contacts.txt with user-provided raw text and reloads memory
 */
export async function POST(request) {
  try {
    const manager = getContactManager();
    const body = await request.text();

    fs.writeFileSync(manager.primaryFilePath, body, "utf8");
    if (fs.existsSync(path.dirname(manager.secondaryFilePath))) {
      fs.writeFileSync(manager.secondaryFilePath, body, "utf8");
    }

    manager.loadFromFile();

    return NextResponse.json({
      success: true,
      message: "contacts.txt imported and synced successfully!",
      totalLoaded: manager.contacts.size(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to import contacts.txt" },
      { status: 500 }
    );
  }
}
