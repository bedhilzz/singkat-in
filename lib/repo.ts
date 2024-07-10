import { ShortenedUrl } from '@/interfaces'
import clientPromise from '@/lib/mongodb'

export const createShortenedUrl = async (shortenedUrl: ShortenedUrl) => {
  try {
    const client = await clientPromise
    const db = client.db('main')
    const collection = db.collection('shortened_urls')
    const insertedDoc = await collection.insertOne(shortenedUrl)
    const shortenedUrlDoc = await collection.findOne<ShortenedUrl>(insertedDoc.insertedId)

    return shortenedUrlDoc
  } catch (e) {
    console.error(e)
  }
}

export const getShortenedUrl = async (custom_endpoint: string) => {
  try {
    const client = await clientPromise
    const db = client.db('main')
    const collection = db.collection('shortened_urls')

    const filter = {
      custom_endpoint: custom_endpoint,
      expiration_date: {
        '$gte': new Date()
      }
    }
    
    const shortenedUrlDoc = await collection
      .findOne<ShortenedUrl>(filter)

    return shortenedUrlDoc
  } catch (e) {
    console.error(e)
  }
}