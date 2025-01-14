import { connectDb } from "@/lib/db";
import { Users } from "@/models/usermodel";
import { ApiReponse } from "@/utils/apiResponse";
import { registerSchema } from "@/utils/validation";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { v4 } from "uuid";
import { generateEncryptedPassword } from "@/utils/bcryptjs";
import { Resend } from "resend";
import { RESEND_EMAIL_KEY } from "@/utils/env";
import ConfirmationEmail from "@/components/EmailTemplate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const registerData = await registerSchema.parseAsync(body);

    await connectDb();
    // check user exist or not
    const isExisted = await Users.findOne({ email: registerData.email });
    if (isExisted) {
      if (isExisted.isEmailVerified === false) {
        return NextResponse.json(
          new ApiReponse(
            422,
            "Email is register but yet not verified check your email.",
            {},
            false
          ),
          { status: 422 }
        );
      } else {
        return NextResponse.json(
          new ApiReponse(409, "Email is already in use.", {}, false),
          { status: 409 }
        );
      }
    }

    // register the user
    const emailConfrimString = v4();
    const hashedPassword = generateEncryptedPassword(registerData.password);
    await Users.create({
      firstName: registerData.firstName,
      lastName: registerData.lastName || "",
      email: registerData.email,
      password: hashedPassword,
      emailConfrimationCode: emailConfrimString,
    });

    const protocol = request.url?.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${request.url}`;
    const confirmationUrl = `${baseUrl}/api/user/confirmemail/${emailConfrimString}`;

    const resendEmail = new Resend(RESEND_EMAIL_KEY);
    const { error } = await resendEmail.emails.send({
      from: "tracksmart01@gmail.com",
      to: registerData.email,
      subject: "Email Confirmation",
      react: ConfirmationEmail({
        confirmationUrl: confirmationUrl,
        firstName: registerData.email,
      }),
    });

    if (error) {
      return NextResponse.json(new ApiReponse(500, error.message, {}, false), {
        status: 500,
      });
    }

    return NextResponse.json(
      new ApiReponse(
        201,
        "Email registered successfully, check email for confirmation",
        {},
        true
      ),
      {
        status: 201,
      }
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
