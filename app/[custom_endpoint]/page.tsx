'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default async function Page({ params }: { params: { custom_endpoint: string } }) {
    const router = useRouter()

    const handleGetShortenedUrl = async () => {
        try {
            const response = await fetch(`/api/shorten_url/${params.custom_endpoint}`)
            const data = await response.json()
            router.push(data.actual_url)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetShortenedUrl()
    }, [])
}