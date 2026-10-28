import { NextResponse } from "next/server";
import { getContactManager } from "@/lib/dsa/ContactManager";
import { Contact } from "@/lib/dsa/Contact";

export const dynamic = "force-dynamic";

/**
 * GET /api/contacts
 * Query parameters:
 * - q: search query string
 * - field: 'all' | 'name' | 'phone' | 'email'
 * - favorites: 'true' | 'false'
 * - sort: 'name' | 'phone' | 'date'
 * - order: 'asc' | 'desc'
 */
export async function GET(request) {
  try {
    const manager = getContactManager();
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const field = searchParams.get("field") || "all";
    const favoritesOnly = searchParams.get("favorites") === "true";
    const sort = searchParams.get("sort");
    const order = searchParams.get("order") || "asc";

    // 1. Sort if requested
    if (sort === "name") {
      manager.sortByName(order);
    } else if (sort === "phone") {
      manager.sortByPhone(order);
    } else if (sort === "date") {
      manager.sortByDateAdded(order);
    }

    // 2. Search
    let results = [];
    if (query.trim()) {
      results = manager.search(query, field);
    } else {
      results = manager.viewContacts();
    }

    // 3. Filter favorites if requested
    if (favoritesOnly) {
      results = results.filter((c) => c.getFavorite());
    }

    const contactsJson = results.map((c) => c.toJSON());
    const stats = manager.showStatistics();

    return NextResponse.json({
      success: true,
      data: contactsJson,
      count: contactsJson.length,
      stats,
      metrics: manager.lastOperationMetrics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contacts
 * Adds a new contact with strict C++ validation
 */
export async function POST(request) {
  try {
    const manager = getContactManager();
    const body = await request.json();

    const { name, phone, email, address, favorite, dateAdded } = body;

    const newContact = new Contact(
      name,
      phone,
      email,
      address,
      favorite,
      dateAdded || Contact.getCurrentDate()
    );

    manager.addContact(newContact);

    return NextResponse.json({
      success: true,
      message: "Contact Added Successfully!",
      contact: newContact.toJSON(),
      metrics: manager.lastOperationMetrics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add contact" },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/contacts
 * Updates an existing contact identified by oldPhone
 */
export async function PUT(request) {
  try {
    const manager = getContactManager();
    const body = await request.json();

    const { oldPhone, name, phone, email, address, favorite, dateAdded } = body;

    if (!oldPhone) {
      return NextResponse.json(
        { success: false, error: "Missing oldPhone to locate contact" },
        { status: 400 }
      );
    }

    const updatedContact = new Contact(
      name,
      phone,
      email,
      address,
      favorite,
      dateAdded || Contact.getCurrentDate()
    );

    const updated = manager.updateContact(oldPhone, updatedContact);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Contact Not Found!" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact Updated Successfully!",
      contact: updatedContact.toJSON(),
      metrics: manager.lastOperationMetrics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update contact" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/contacts
 * Deletes a contact by phone number
 */
export async function DELETE(request) {
  try {
    const manager = getContactManager();
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone parameter is required" },
        { status: 400 }
      );
    }

    const deleted = manager.deleteContact(phone);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Contact Not Found!" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact Deleted Successfully!",
      metrics: manager.lastOperationMetrics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete contact" },
      { status: 500 }
    );
  }
}
