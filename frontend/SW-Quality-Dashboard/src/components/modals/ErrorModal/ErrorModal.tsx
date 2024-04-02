import {Alert, Button, Modal} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import apiUrls from "../../../assets/data/api_urls.json";
import {isProduction} from "../../../assets/data/config.json"

function ErrorModal({modalTitle, modalAlertMessage}) {
    const [baseApiUrl, setBaseApiUrl] = useState(isProduction ? apiUrls.productionBackend : apiUrls.developmentBackend);

    const [resendBtnText, setResendBtnText] = useState("Resend Verification Email");
    const [resendBtnDisabled, setResendBtnDisabled] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [show, setShow] = useState(true);

    // Make the modal redirect to the home page after 5 seconds and disappear
    setTimeout(() => {
        window.location.href = "/";
    }, 5000);

    return (
        <>
            <Modal
                show={show}
                backdrop="static"
                keyboard={false}
                onHide={() => setShow(true)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-exclamation-triangle"> </i>
                        {modalTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="danger">
                        <i className="bi bi-info-circle"> </i>
                        <strong> {modalAlertMessage} </strong>
                    </Alert>
                    <p>
                        You will be redirected to the home page in a few seconds...
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" href="/">
                        Redirect Now
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ErrorModal