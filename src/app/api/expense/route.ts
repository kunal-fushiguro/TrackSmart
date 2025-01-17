import { Expense } from "@/models/expensemodel";
import { Users } from "@/models/usermodel";
import { ApiReponse } from "@/utils/apiResponse";
import { authWrapper } from "@/utils/authWrapper";
import { expenseSchema } from "@/utils/validation";
import { serialize } from "cookie";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    await authWrapper(
      request,
      async function (request: Request, userId: string) {
        const body = await request.json();
        const data = await expenseSchema.parseAsync(body);

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

        const createExpense = await Expense.create({
          userId: findUserById._id,
          typeOfExpense: data.typeOfExpense,
          amount: data.amount,
          date: data.date,
          category: data.category,
          description: data.description,
        });

        await Users.findByIdAndUpdate(
          findUserById._id,
          {
            $push: {
              expense: createExpense._id,
            },
          },
          { new: true }
        );

        return NextResponse.json(
          new ApiReponse(
            200,
            "Expense created.",
            { expense: createExpense },
            true
          ),
          { status: 200 }
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

export async function PUT(request: Request) {
  try {
    await authWrapper(
      request,
      async function (request: Request, userId: string) {
        const body = await request.json();
        const data = await expenseSchema.parseAsync(body);

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

        const updateExpense = await Expense.findOneAndUpdate(
          { userId: findUserById._id },
          { userId: findUserById._id, ...data }
        );

        if (!updateExpense) {
          return NextResponse.json(
            new ApiReponse(404, "Expense not found", {}, false),
            { status: 404 }
          );
        }

        return NextResponse.json(
          new ApiReponse(
            200,
            "Expense Updated successfully",
            { updateExpense },
            true
          ),
          { status: 200 }
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

export async function DELETE(request: Request) {
  try {
    await authWrapper(
      request,
      async function (request: Request, userId: string) {
        console.log(request.url);

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

        const updateExpense = await Expense.findOneAndDelete({
          userId: findUserById._id,
        });

        if (!updateExpense) {
          return NextResponse.json(
            new ApiReponse(404, "Expense not found", {}, false),
            { status: 404 }
          );
        }

        return NextResponse.json(
          new ApiReponse(200, "Expense deleted successfully", {}, true),
          { status: 200 }
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
