import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Container, Row } from 'react-bootstrap'

export default function NotFound() {
  return (
    <Container className='d-flex flex-row justify-content-center mt-5'>
      <Row>
        <Col>
          <h1 className='display-1 text-center'>404 Not found</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Your URL can't be found</p>
          <Link href="/">Return Home</Link>
        </Col>
      </Row>
    </Container>
  )
}