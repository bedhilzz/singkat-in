'use client'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useEffect, useRef, useState } from 'react'
import { FormEvent } from 'react'
import ResponseModel from '@/components/modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { Container } from 'react-bootstrap'

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null)
  const [hostname, setHostname] = useState<string>('')
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalBody, setModalBody] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isErrorModal, setIsErrorModal] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleClose = () => {
    setShowModal(false)
  }

  const showSuccessResponseModal = (body: string) => {
    const title: string = 'Your shortened link is ready!'
    setModalTitle(title)
    setModalBody(`${hostname}/${body}`)
    setIsErrorModal(false)
    setShowModal(true)
  }

  const showFailResponseModal = (body: string) => {
    const title: string = 'Error has occured!'
    setModalTitle(title)
    setModalBody(`Custom endpoint "${body}" already exists!`)
    setIsErrorModal(true)
    setShowModal(true)
  }

  const handleShortenUrl = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/shorten_url', {
        method: 'POST',
        body: JSON.stringify({
          actual_url: formData.get('actualUrl'),
          custom_endpoint: formData.get('customEndpoint'),
          expiration_time: formData.get('expirationDate')
        })
      })

      const data = await response.json()

      if (response.status == 409) {
        showFailResponseModal(data.custom_endpoint as string)
      } else {
        showSuccessResponseModal(data.custom_endpoint as string)
      }
    } catch (error) {
      console.log(error)
    } finally {
      formRef.current?.reset()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  return (
    <>
      <ResponseModel
        title={modalTitle}
        body={modalBody}
        show={showModal}
        isError={isErrorModal}
        handleClose={handleClose}
      ></ResponseModel>
      <Container>
        <div className='d-flex flex-row justify-content-center mt-5'>
          <div className='col'>
            <h1 className='display-1 text-center mt-5'> <i className='bi bi-link-45deg'></i> Singkat-in</h1>
          </div>
        </div>
        <div className='d-flex-flex-row justify-content-center mt-5'>
          <div className='col'>
            <Form
              onSubmit={handleShortenUrl}
              ref={formRef}
            >
              <Form.Control name='actualUrl' className='mt-4' type="url" placeholder="https://yourdomain.example/very-long-url" required />
              <InputGroup className='mt-4'>
                <InputGroup.Text>
                  {hostname}/
                </InputGroup.Text>
                <Form.Control name='customEndpoint' placeholder='Your customized endpoint (e.g. MyFirstYoutubeVideo)' />
              </InputGroup>
              <Form.Text id="customEndpointHelp" muted>
                If it's left unspecified, you will get random endpoint from us, customized endpoint availability will also be checked.
              </Form.Text>
              <InputGroup className="mt-4">
                <InputGroup.Text>
                  Expiration Link
                </InputGroup.Text>
                <Form.Control name='expirationDate' type='date' />
              </InputGroup>
              <Form.Text id="expirationLinkHelp">
                If it's left unspecified, your link will be automatically expired in 90 days.
              </Form.Text>
              <div className='d-flex justify-content-center mt-4'>
                <Button
                  className='btn btn-lg btn-primary'
                  type='submit'
                  disabled={isLoading}
                >
                  {isLoading ?
                    <><span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Loading...</>
                    : <><i className='bi bi-link-45deg'></i> Singkat-in</>}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </>
  );
}
