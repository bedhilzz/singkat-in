'use server'

import { NextRequest, NextResponse } from 'next/server'
import { ShortenedUrl } from '@/interfaces'
import { createShortenedUrl, getShortenedUrl } from '@/lib/repo'
import ShortUniqueId from 'short-unique-id'


const generateExpirationDate = (): Date => {
    let date: Date = new Date()
    date.setDate(date.getDate() + 90);
    return date
}

export const POST = async (req: NextRequest) => {
    const data = await req.json()

    try {
        const expiration_date: Date = data.expiration_date || generateExpirationDate()
        let shortenedUrl: ShortenedUrl = {
            actual_url: data.actual_url,
            custom_endpoint: '',
            expiration_date: expiration_date
        }

        if (!data.custom_endpoint) {
            shortenedUrl.custom_endpoint = (new ShortUniqueId).rnd()
        } else {
            const existingShortenedUrl = await getShortenedUrl(data.custom_endpoint)
            
            if (!existingShortenedUrl) {
                shortenedUrl.custom_endpoint = data.custom_endpoint
            } else {
                // Shortened URL with provided custom endpoint exists, return 409
                return NextResponse.json(existingShortenedUrl, {status: 409})
            }
        }
        
        const shortenedUrlDoc = await createShortenedUrl(shortenedUrl)

        return NextResponse.json(shortenedUrlDoc, {status: 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json(null, {status: 500})
    }
}
