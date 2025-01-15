import { Users } from "@/models/usermodel";
import { ApiReponse } from "@/utils/apiResponse";
import { validateEncryptPassword } from "@/utils/bcryptjs";
import { generateToken } from "@/utils/jwt";
import { loginSchema } from "@/utils/validation";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { serialize } from "cookie";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const loginData = await loginSchema.parseAsync(body);

    const findUserWithEmail = await Users.findOne({ email: loginData.email });

    if (!findUserWithEmail) {
      return NextResponse.json(
        new ApiReponse(404, "Email not found", {}, false),
        { status: 404 }
      );
    }

    const isPasswordCorrect = await validateEncryptPassword(
      loginData.password,
      findUserWithEmail.password
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        new ApiReponse(400, "Invalid details", {}, false),
        { status: 400 }
      );
    }

    const token = await generateToken(findUserWithEmail._id);
    const cookieToken = serialize("userToken", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return NextResponse.json(
      new ApiReponse(
        200,
        "Login successfully",
        {
          user: {
            firstName: findUserWithEmail.firstName,
            lastName: findUserWithEmail.lastName,
            email: findUserWithEmail.email,
            profilePic: findUserWithEmail.profilePic,
            isEmailVerified: findUserWithEmail.isEmailVerified,
            monthlyIncome: findUserWithEmail.monthlyIncome,
          },
        },
        true
      ),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookieToken,
        },
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
