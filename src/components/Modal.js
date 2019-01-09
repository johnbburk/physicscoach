
import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./../styles/Modal.css";


const Modal = ({ handleClose, show, children, buttonText }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
  
    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          {children}
          <button onClick={handleClose}>{buttonText}</button>
        </section>
      </div>
    );
  };

  export default Modal;
