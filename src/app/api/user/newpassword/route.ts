import { ApiReponse } from "@/utils/apiResponse";
import { resetPasswordSchema } from "@/utils/validation";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { JWT_TOKEN_EMAIL } from "@/utils/env";
import { serialize } from "cookie";
import { Users } from "@/models/usermodel";
import { generateEncryptedPassword } from "@/utils/bcryptjs";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = await resetPasswordSchema.parseAsync(body);

    const isValidToken = await jwt.verify(token, String(JWT_TOKEN_EMAIL));

    const cookieToken = serialize("userToken", "", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      maxAge: 0,
      expires: new Date(Date.now()),
    });
    if (
      !isValidToken ||
      typeof isValidToken !== "object" ||
      !("email" in isValidToken)
    ) {
      return NextResponse.json(
        new ApiReponse(400, "Invalid Token.", {}, false),
        { status: 400, headers: { "Set-Cookie": cookieToken } }
      );
    }

    const findUserByEmail = await Users.findOne({ email: isValidToken.email });
    if (!findUserByEmail) {
      return NextResponse.json(
        new ApiReponse(400, "Invalid Token email not found.", {}, false),
        { status: 400, headers: { "Set-Cookie": cookieToken } }
      );
    }

    if (findUserByEmail.forgetPasswordTime > new Date(Date.now())) {
      const newpass = await generateEncryptedPassword(newPassword);
      await Users.findByIdAndUpdate(findUserByEmail._id, { password: newpass });

      return NextResponse.json(
        new ApiReponse(200, "Password reset successfully", {}, true),
        { status: 200, headers: { "Set-Cookie": cookieToken } }
      );
    } else {
      return NextResponse.json(
        new ApiReponse(400, "Token expried.", {}, false),
        { status: 400, headers: { "Set-Cookie": cookieToken } }
      );
    }
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
