import { NextResponse } from "next/server";
import { ApiReponse } from "./apiResponse";
import { validateToken } from "./jwt";
import { serialize } from "cookie";

export async function authWrapper(
  request: Request,
  fn: (request: Request, userId: string) => Promise<any>
) {
  try {
    const cookie = await request.headers.get("cookie");
    const token = cookie?.split("userToken=")[1].trim();

    const isTokenValid = await validateToken(token || "");

    const cookieToken = serialize("userToken", "", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      maxAge: 0,
      expires: new Date(Date.now()),
    });

    if (
      !isTokenValid ||
      typeof isTokenValid !== "object" ||
      !("email" in isTokenValid)
    ) {
      return NextResponse.json(
        new ApiReponse(400, "Invalid User.", {}, false),
        { status: 400, headers: { "Set-Cookie": cookieToken } }
      );
    }

    await fn(request, isTokenValid.userId);
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
