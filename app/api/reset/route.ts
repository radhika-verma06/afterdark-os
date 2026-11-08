import { NextResponse } from "next/server";
import { seedCampus } from "@/prisma/seed";
import { db } from "@/lib/db";
export async function POST(){try{await seedCampus(db);return NextResponse.json({ok:true,message:"Aster Campus demo data restored."});}catch{return NextResponse.json({error:"Could not reset demo data. Ensure the database is set up."},{status:500});}}
