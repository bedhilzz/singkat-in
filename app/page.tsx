'use client'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useEffect, useRef, useState } from 'react'
import { FormEvent } from 'react'
import ResponseModel from '@/components/modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { Col, Container, Row, Toast, ToastContainer } from 'react-bootstrap'
import Link from 'next/link'
import { constructErrorMessage } from '@/lib/util'

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null)
  const [hostname, setHostname] = useState<string>('')
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalBody, setModalBody] = useState<string>('')
  const [toastHeader, setToastHeader] = useState<string>('')
  const [toastBody, setToastBody] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showToast, setShowToast] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  const showSuccessResponseModal = (body: string) => {
    const title: string = 'Your shortened link is ready!'
    setModalTitle(title)
    setModalBody(`${hostname}/${body}`)
    setShowModal(true)
  }

  const showErrorToast = (errorCode: string) => {
    const title: string = 'Error has occured!'
    const errorMessage: string = constructErrorMessage(errorCode)
    setToastHeader(title)
    setToastBody(errorMessage)
    setShowToast(true)
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

      const data: any = await response.json()

      if (response.status != 200) {
        showErrorToast(data.error_code)
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

  const handleExpirationDateValidity = (e: any) => {
    let date = new Date(Date.parse(e.target.value))

    if (date < new Date()) {
      e.target.setCustomValidity('Please select a date in the future.')
    } else {
      e.target.setCustomValidity('')
    }
  }

  const handleCustomEndpointValidity = (e: any) => {
    const pattern = /^[a-zA-Z0-9_]*$/
    const customEndpoint = e.target.value || ''

    if (!pattern.test(customEndpoint)) {
      e.target.setCustomValidity('Only accept alphanumeric and underscore')
    } else {
      e.target.setCustomValidity('')
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
        handleClose={() => setShowModal(false)}
      ></ResponseModel>
      <Container>
        <ToastContainer
          className='p-3'
          position='top-center'
          style={{ zIndex: 1 }}
        >
          <Toast className='bg-danger' show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide>
            <Toast.Header closeButton={true}>
              <strong className='me-auto'>{toastHeader}</strong>
            </Toast.Header>
            <Toast.Body className='text-white'>{toastBody}</Toast.Body>
          </Toast>
        </ToastContainer>
        <div className='d-flex flex-column align-items-stretch justify-content-between vh-100'>
          <div className='d-flex flex-column align-items-stretch justify-content-center h-100'>
            <h1 className='display-1 text-center mt-5'>
              <i className='bi bi-link-45deg'></i> Singkat-in
            </h1>
            <Form
              onSubmit={handleShortenUrl}
              ref={formRef}
              className='mt-5'
            >
              <Form.Group>
                <Form.Label>Actual URL</Form.Label>
                <Form.Control name='actualUrl' type='url' placeholder='https://yourdomain.example/very-long-url' required />
              </Form.Group>
              <Form.Group className='mt-4'>
                <Form.Label>Custom Endpoint</Form.Label>
                <InputGroup >
                  <InputGroup.Text>
                    {hostname}/
                  </InputGroup.Text>
                  <Form.Control name='customEndpoint' placeholder='e.g. MyFirstYoutubeVideo' pattern='^[a-zA-Z0-9_]*$' onChange={handleCustomEndpointValidity} />
                </InputGroup>
                <Form.Text id='customEndpointHelp' muted>
                  Only accept <b>alphanumeric or underscore</b>, the availability will be checked. If it's left unspecified, you will get random endpoint from us.
                </Form.Text>
              </Form.Group>
              <Form.Group className='mt-4'>
                <Form.Label>Expiration Link</Form.Label>
                <Form.Control name='expirationDate' type='date' onChange={handleExpirationDateValidity} />
                <Form.Text id='expirationLinkHelp'>
                  If it's left unspecified, your link will be automatically expired in 90 days.
                </Form.Text>
              </Form.Group>
              <div className='d-flex justify-content-center mt-5'>
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
          <div className='d-flex justify-content-center mt-5'>
            <p>Reach me in <i className='bi bi-github'></i> <Link href={'https://github.com/bedhilzz/singkat-in'}>@bedhilzz</Link></p>
          </div>
        </div>
      </Container>
    </>
  );
}
