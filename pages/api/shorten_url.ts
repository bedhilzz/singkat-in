'use server'

import { ShortenedUrl } from '../interfaces/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<null | ShortenedUrl>
) {
    const data = JSON.parse(req.body)

    try {
        const expiration_date: Date = data.expiration_date || generateExpirationDate()

        const shortenedUrl: ShortenedUrl = {
            actual_url: data.actual_url,
            custom_endpoint: data.custom_endpoint,
            expiration_date: expiration_date
        }

        res.status(200).json(shortenedUrl)
    } catch (error) {
        console.log(error)
        res.status(500).json(null)
    }
}

function generateExpirationDate(): Date {
    let date: Date = new Date()
    date.setDate(date.getDate() + 90);
    return date
}