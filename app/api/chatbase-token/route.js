import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const secret = process.env.CHATBOT_IDENTITY_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: "Missing CHATBOT_IDENTITY_SECRET" },
        { status: 500 }
      );
    }

    // 👉 Aquí obtienes el usuario real de tu backend.
    // Ejemplo mock, tú deberías reemplazarlo:
    const user = {
      id: "123",
      email: "user@example.com",
      stripe_accounts: ["acct_12345"],
    };

    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        stripe_accounts: user.stripe_accounts,
      },
      secret,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { error: "Error generating token" },
      { status: 500 }
    );
  }
}
