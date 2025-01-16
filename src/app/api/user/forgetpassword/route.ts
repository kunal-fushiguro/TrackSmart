import { Users } from "@/models/usermodel";
import { ApiReponse } from "@/utils/apiResponse";
import { emailSchema } from "@/utils/validation";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_TOKEN_EMAIL, RESEND_EMAIL_KEY } from "@/utils/env";
import { Resend } from "resend";
import ResetPasswordEmail from "@/components/ResetPasswordEmail";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = await emailSchema.parseAsync(body);

    const generateCode = await jwt.sign({ email }, String(JWT_TOKEN_EMAIL));
    const findUserByEmail = await Users.findOneAndUpdate(
      { email },
      {
        forgetPasswordTime: new Date(Date.now() + 5 * 60 * 1000),
        forgetPasswordCode: generateCode,
      }
    );

    if (!findUserByEmail) {
      return NextResponse.json(
        new ApiReponse(404, "Email not found.", {}, false),
        { status: 404 }
      );
    }

    const parsedUrl = new URL(request.url);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
    const resetUrl = `${baseUrl}/user/resetPassword/${generateCode}`;

    const resendEmail = new Resend(RESEND_EMAIL_KEY);
    const { error } = await resendEmail.emails.send({
      from: "tracksmart01@gmail.com",
      to: email,
      subject: "Reset Email",
      react: ResetPasswordEmail({
        firstName: findUserByEmail.firstName,
        resetPasswordUrl: resetUrl,
      }),
    });

    if (error) {
      return NextResponse.json(new ApiReponse(500, error.message, {}, false), {
        status: 500,
      });
    }

    return NextResponse.json(
      new ApiReponse(200, "Check your email to reset password", {}, true),
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
