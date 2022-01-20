import React from "react"
import './Modal.css'

function Modal(props) {

  return (
    <div className="modal">
        <div className="modal-inner">
            <div className="close-button" onClick={props.modalClick}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
            </div>
            <h1>About Covid Tracker</h1>
            <p>
                Select a date from the date picker. Click submit to see Covid-19 deaths and cases for that day. 
                Note that the maximum date is from 2 days ago, when the data was most recently updated. 
                The map and bar chart are color coded by deaths. Clicking a state will scroll to that state's data in the table, which contains total daily deaths/cases and total deaths/cases to the date selected. Total deaths/cases for all states on the date selected display to the right of the date picker.            </p>
            <p>
                Data is collected from the CDC Covid Data API:<br/>
                <a href="https://data.cdc.gov/Case-Surveillance/United-States-COVID-19-Cases-and-Deaths-by-State-o/9mfq-cb36/data" target="_blank" rel="noreferrer">
                https://data.cdc.gov/Case-Surveillance/United-States-COVID-19-Cases-and-Deaths-by-State-o/9mfq-cb36/data
                </a>
            </p>
            <p>
                App created by <a href="https://jamesravelle.github.io/" target="_blank" rel="noreferrer">James Ravelle</a> using React, D3.js, Javascript, HTML and CSS.
            </p>
        </div>
    </div>
  );
}

export default Modal;
