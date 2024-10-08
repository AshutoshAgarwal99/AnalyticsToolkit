import React from 'react'

// Modal to show errors
const Modal = () => {
    return (
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Alert!</h3>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div
                  className="alert alert-warning"
                  id="error-div"
                  role="alert"
                >
                  Error in uploading file. Make sure maximum file size is 10MB
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Modal
