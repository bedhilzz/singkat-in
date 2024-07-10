import { getShortenedUrl } from "@/lib/repo"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (
    req: NextRequest,
    { params }: { params: { custom_endpoint: string } }
) => {
    const custom_endpoint = params.custom_endpoint

    try {
        if (!custom_endpoint) {
            // No custom endpoint supplied, return 404
            notFound()
        } else {
            const shortenedUrlDoc = await getShortenedUrl(custom_endpoint)
            
            if (!shortenedUrlDoc) {
                // No shortened URL found, return 404
                notFound()
            } else {
                return NextResponse.redirect(new URL(shortenedUrlDoc.actual_url))
            }
        }

    } catch (error) {
        console.log(error)
        notFound()
    }
}