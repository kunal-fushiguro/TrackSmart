import { ApiReponse } from "@/utils/apiResponse";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_TOKEN_EMAIL } from "@/utils/env";
import { Users } from "@/models/usermodel";

export async function POST({ params }: { params: { code: string } }) {
  try {
    const { code } = await params;
    const data = jwt.verify(code, String(JWT_TOKEN_EMAIL));

    if (!data || typeof data !== "object" || !("email" in data)) {
      return NextResponse.json(
        new ApiReponse(400, "Email code is not valid.", {}, false),
        { status: 400 }
      );
    }

    const email = (data as JwtPayload).email;
    const findUserAndVerifyEmail = await Users.findByIdAndUpdate(
      {
        email: email,
      },
      { isEmailVerified: true }
    );

    if (!findUserAndVerifyEmail) {
      return NextResponse.json(
        new ApiReponse(404, "User Not Found", {}, false),
        { status: 404 }
      );
    }

    return NextResponse.json(
      new ApiReponse(200, "Email verified successfully.", {}, true),
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json(new ApiReponse(500, error.message, {}, false), {
        status: 500,
      });
    }

    if (error instanceof ZodError) {
      console.error(error.message);
      return NextResponse.json(new ApiReponse(400, error.message, {}, false), {
        status: 400,
      });
    }

    console.error(error.message);
    return NextResponse.json(new ApiReponse(500, error.message, {}, false), {
      status: 500,
    });
  }
}
