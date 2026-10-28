import { NextResponse } from "next/server";

// In-memory / mocked users store with hashed credentials simulation (DSA Map)
const usersMap = new Map();

// Seed a default admin/demo user
usersMap.set("admin@contacthub.com", {
  id: "user-admin",
  name: "Vinay Admin",
  email: "admin@contacthub.com",
  password: "password123",
  role: "Administrator",
  avatarUrl: null,
  createdAt: "2026-10-28",
});

usersMap.set("demo@contacthub.com", {
  id: "user-demo",
  name: "Alex Hunter",
  email: "demo@contacthub.com",
  password: "demo",
  role: "User",
  avatarUrl: null,
  createdAt: "2026-10-28",
});

/**
 * POST /api/auth
 * Action: 'login' | 'signup' | 'demo'
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    // Instant Demo Login
    if (action === "demo") {
      const demoUser = usersMap.get("admin@contacthub.com");
      return NextResponse.json({
        success: true,
        message: "Signed in as Demo Administrator",
        user: {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
        },
      });
    }

    // Normal Login
    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: "Please enter both email and password." },
          { status: 400 }
        );
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const existingUser = usersMap.get(normalizedEmail);

      if (!existingUser || existingUser.password !== password) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password. Use demo login or create an account." },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Logged in successfully!",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      });
    }

    // Sign Up / Register
    if (action === "signup") {
      if (!name || !email || !password) {
        return NextResponse.json(
          { success: false, error: "Name, email, and password are required." },
          { status: 400 }
        );
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      if (usersMap.has(normalizedEmail)) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists." },
          { status: 400 }
        );
      }

      if (password.length < 4) {
        return NextResponse.json(
          { success: false, error: "Password must be at least 4 characters long." },
          { status: 400 }
        );
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: String(name).trim(),
        email: normalizedEmail,
        password: String(password),
        role: "User",
        createdAt: new Date().toISOString(),
      };

      usersMap.set(normalizedEmail, newUser);

      return NextResponse.json({
        success: true,
        message: "Account created successfully!",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Authentication error" },
      { status: 500 }
    );
  }
}
