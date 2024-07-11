import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

function ResponseModel(params: {
    title: string,
    body: string,
    show: boolean,
    handleClose: () => void
}) {
    return (
        <Modal show={params.show} onHide={params.handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{params.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <InputGroup>
                    <Form.Control value={params.body} disabled />
                    <Button variant="outline-secondary" onClick={() => { navigator.clipboard.writeText(params.body) }}>
                        Copy <i className='bi bi-clipboard'></i>
                    </Button>
                </InputGroup>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="danger" onClick={params.handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ResponseModel;