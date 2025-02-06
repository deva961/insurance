import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Handle POST requests
export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    // Save the form data to the database
    await db.sabooLanding.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    return NextResponse.json(
      { message: "Thank you for contacting us. We will get back to you soon!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during POST:", error);
    return NextResponse.json(
      { message: "Failed to process the request" },
      { status: 500 }
    );
  }
}

// Handle other methods (like GET)
export function GET() {
  return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
}
