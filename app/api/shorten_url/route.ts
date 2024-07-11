'use server'

import { NextRequest, NextResponse } from 'next/server'
import { ShortenedUrl } from '@/interfaces'
import { createShortenedUrl, getShortenedUrl } from '@/lib/repo'
import ShortUniqueId from 'short-unique-id'
import { isValidUrl, isValidCustomEndpoint, isValidExpirationDate, ERROR_CODE } from '@/lib/util'

const validateInput = (input: any): string => {
    if (!isValidUrl(input.actual_url)) {
        return ERROR_CODE.INVALID_URL
    }

    if (!isValidCustomEndpoint(input.custom_endpoint)) {
        return ERROR_CODE.INVALID_CUSTOM_ENDPOINT
    }

    if (!isValidExpirationDate(input.expiration_date)) {
        return ERROR_CODE.INVALID_EXPIRATION_DATE
    }

    return 'VALID'
}

const generateExpirationDate = (): Date => {
    let date: Date = new Date()
    date.setDate(date.getDate() + 90);
    return date
}

export const POST = async (req: NextRequest) => {
    const input = await req.json()

    try {
        // Validate input, return 422 for invalid input
        const message = validateInput(input)
        if (message != 'VALID') {
            return NextResponse.json({ error_code: message }, { status: 422 })
        }

        const expiration_date: Date = input.expiration_date || generateExpirationDate()
        let shortenedUrl: ShortenedUrl = {
            actual_url: input.actual_url,
            custom_endpoint: '',
            expiration_date: expiration_date
        }

        if (!input.custom_endpoint || input.custom_endpoint == '') {
            // Generate short unique ID if custom endpoint unspecified
            shortenedUrl.custom_endpoint = (new ShortUniqueId).rnd()
        } else {
            const existingShortenedUrl = await getShortenedUrl(input.custom_endpoint)

            if (!existingShortenedUrl) {
                shortenedUrl.custom_endpoint = input.custom_endpoint
            } else {
                // Shortened URL with provided custom endpoint exists, return 409
                return NextResponse.json({ error_code: ERROR_CODE.CUSTOM_ENDPOINT_UNAVAILABLE }, { status: 409 })
            }
        }

        const shortenedUrlDoc = await createShortenedUrl(shortenedUrl)

        return NextResponse.json(shortenedUrlDoc, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(null, { status: 500 })
    }
}
