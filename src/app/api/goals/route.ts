import { Goals } from "@/models/goalmodel";
import { Users } from "@/models/usermodel";
import { ApiReponse } from "@/utils/apiResponse";
import { authWrapper } from "@/utils/authWrapper";
import { goalsSchema } from "@/utils/validation";
import { serialize } from "cookie";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    await authWrapper(
      request,
      async function (request: Request, userId: string) {
        const body = await request.json();
        const data = await goalsSchema.parseAsync(body);

        const findUserById = await Users.findById(userId);
        if (!findUserById) {
          const cookieToken = serialize("userToken", "", {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: true,
            maxAge: 0,
            expires: new Date(Date.now()),
          });
          return NextResponse.json(
            new ApiReponse(404, "User not found", {}, false),
            { status: 404, headers: { "Set-Cookie": cookieToken } }
          );
        }

        const createGoals = await Goals.create({
          userId: findUserById._id,
          goals: data,
        });

        const users = await Users.findByIdAndUpdate(
          findUserById._id,
          { goal: createGoals._id },
          { new: true }
        ).populate("goal");

        return NextResponse.json(
          new ApiReponse(
            201,
            "Goals created.",
            {
              user: [
                {
                  firstName: users.firstName,
                  lastName: users.lastName,
                  email: users.email,
                  profilePic: users.profilePic,
                  isEmailVerified: users.isEmailVerified,
                  monthlyIncome: users.monthlyIncome,
                  goal: users.goal,
                },
              ],
            },
            true
          ),
          { status: 201 }
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
