import React, {useState} from 'react'

function Index() {
    const [errorMessage, setErrorMessage] = useState('Hello Bug')
    const [errorTitle, setErrorTitle] = useState('Ops!')
    const [successMessage, setSuccessMessage] = useState('Hello Human')
    const [successTitle, setSuccessTitle] = useState('Félicitation')
  return (
    <>
        {/* Button trigger modal */}
        <button id="error-button" type="button" className="d-none btn btn-danger" data-bs-toggle="modal" data-bs-target="#errorModal">
            Error modal
        </button>
        <button id="success-button" type="button" className="d-none btn btn-success" data-bs-toggle="modal" data-bs-target="#successModal">
            Success modal
        </button>
        {/* Error Modal */}
        <div className="modal fade" id="errorModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{errorTitle}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {errorMessage}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                </div>
                </div>
            </div>
        </div>
        {/* Success Modal */}
        <div className="modal fade" id="successModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title success" id="exampleModalLabel">{successTitle}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {successMessage}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Index