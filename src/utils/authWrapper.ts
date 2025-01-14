import { NextResponse } from "next/server";

export async function authWrapper(request:Request,fn:() => void) {
    try {
        
    } catch (error:any) {
    if(error instanceof Error){
        console.error(error.message);
        process.exit(1)
    }    
    console.error(error.message);
        process.exit(1)
    }    
}