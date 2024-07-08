'use client'

import 'bootstrap/dist/css/bootstrap.min.css'
import { ShortenedUrl } from './lib/interfaces'
import { shortenUrl } from './lib/api'
import { useEffect } from 'react'

export default function Home() {

  const handleShortenUrl = async () => {
    const params: ShortenedUrl = {
      actual_url: string;
      custom_endpoint: string;
      expiration_time: Date;
    }
    const shortenedUrl = await shortenUrl(params)

  }
  
  useEffect(() => {

  }, [])

  return (
    <main className='container'>
      <div className='d-flex flex-row justify-content-center mt-5'>
        <div className='col'>
          <h1 className='display-1 text-center mt-5'>Singkat-in</h1>
        </div>
      </div>
      <div className='d-flex-flex-row justify-content-center'>
        <div className='col'>
          <div className='input-group mt-3'>
            <input type='text' className='form-control' placeholder='https://yourdomain.example/very-long-url' aria-label='https://yourdomain.example/very-long-url' aria-describedby='button-addon2'></input>
            <button className='btn btn-outline-primary' type='button' id='button-addon2'>Singkat-in <i className="bi bi-link-45deg"></i>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
