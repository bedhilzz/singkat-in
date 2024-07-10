import { getShortenedUrl } from "@/lib/repo"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (
    req: NextRequest,
    { params }: { params: { custom_endpoint: string } }
) => {
    const custom_endpoint = params.custom_endpoint

    try {
        if (!custom_endpoint) {
            // No custom endpoint supplied, return 404
            return NextResponse.json(null, {status: 404})
        } else {
            const shortenedUrlDoc = await getShortenedUrl(custom_endpoint)
            
            if (!shortenedUrlDoc) {
                // No shortened URL found, return 404
                return NextResponse.json(null, {status: 404})
            } else {
                return NextResponse.json(shortenedUrlDoc, {status: 200})
            }
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json(null, {status: 500})
    }
}