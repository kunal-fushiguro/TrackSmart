import { Users } from "@/models/usermodel";
import { ApiReponse } from "@/utils/apiResponse";
import { validateEncryptPassword } from "@/utils/bcryptjs";
import { generateToken } from "@/utils/jwt";
import { loginSchema, updateSchema } from "@/utils/validation";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { serialize } from "cookie";
import { connectDb } from "@/lib/db";
import { authWrapper } from "@/utils/authWrapper";

export async function GET(request: Request) {
  try {
    await authWrapper(
      request,
      async function (request: Request, userId: string) {
        console.log(request.url);
        await connectDb();
        const userExistedOrNot = await Users.findById(userId);

        if (!userExistedOrNot) {
          const cookieToken = serialize("userToken", "", {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: true,
            maxAge: 0,
            expires: new Date(Date.now()),
          });
          return NextResponse.json(
            new ApiReponse(404, "User not found.", {}, false),
            { status: 404, headers: { "Set-Cookie": cookieToken } }
          );
        }

        return NextResponse.json(
          new ApiReponse(
            200,
            "Login successfully",
            {
              user: {
                firstName: userExistedOrNot.firstName,
                lastName: userExistedOrNot.lastName,
                email: userExistedOrNot.email,
                profilePic: userExistedOrNot.profilePic,
                isEmailVerified: userExistedOrNot.isEmailVerified,
                monthlyIncome: userExistedOrNot.monthlyIncome,
              },
            },
            true
          ),
          {
            status: 200,
          }
        );
      }
    );
  } catch (error: any) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json(new ApiReponse(500, error.message, {}, false), {
        status: 500,
      });
    }
    console.error(error.message);
    return NextResponse.json(new ApiReponse(500, error.message, {}, false), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const loginData = await loginSchema.parseAsync(body);

    await connectDb();
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

export async function PUT(request: Request) {
  try {
    await authWrapper(
      request,
      async function (request: Request, userId: string) {
        const body = await request.json();
        const updateData = await updateSchema.parseAsync(body);

        await connectDb();
        const updateAndFindUser = await Users.findByIdAndUpdate(
          userId,
          {
            monthlyIncome: updateData.monthlyIncome,
            profilePic: updateData.profilePic,
          },
          { new: true }
        );

        if (!updateAndFindUser) {
          const cookieToken = serialize("userToken", "", {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: true,
            maxAge: 0,
            expires: new Date(Date.now()),
          });
          return NextResponse.json(
            new ApiReponse(404, "Email not found", {}, false),
            { status: 404, headers: { "Set-Cookie": cookieToken } }
          );
        }

        return NextResponse.json(
          new ApiReponse(
            200,
            "updated successfully",
            {
              user: {
                firstName: updateAndFindUser.firstName,
                lastName: updateAndFindUser.lastName,
                email: updateAndFindUser.email,
                profilePic: updateAndFindUser.profilePic,
                isEmailVerified: updateAndFindUser.isEmailVerified,
                monthlyIncome: updateAndFindUser.monthlyIncome,
              },
            },
            true
          ),
          {
            status: 200,
          }
        );
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
