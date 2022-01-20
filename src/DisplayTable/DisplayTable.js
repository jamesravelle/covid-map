import React, {useState, useEffect, useRef} from 'react';
import './DisplayTable.css'

function DisplayTable(props) {
    const [scroll, setScroll] = useState('');

    const table = useRef(null);

    useEffect(()=>{
        let scrollPosition = Object.keys(props.data).sort().indexOf(props.pos)
        table.current.scrollTop = scrollPosition * 20
    },[props.pos])

    return (
    <section className="table-wrapper">
        <div className="table-row table-header">
            <div class="state">State</div>
            <div class="new">New</div>
            <div class="death">Deaths</div>
            <div class="total-cases">Total Cases</div>
            <div class="total-deaths">Total Deaths</div>
        </div>
        <div className="data-table" ref={table}>
        {
            Object.keys(props.data).sort().map((d,i) => (
                <div className={`table-row ${props.pos === d ? "active" : ""}`} key={d.id} id={d} >
                    <div className="state">{d}</div>
                    <div className="new">{props.formatNum(props.data[d].new)}</div>
                    <div className="death">{props.formatNum(props.data[d].death)}</div>
                    <div className="total-cases">{props.formatNum(props.data[d].totalCases)}</div>
                    <div className="total-deaths">{props.formatNum(props.data[d].totalDeath)}</div>
                </div>
              ))
        }
        </div>
    </section>
  );
}

export default DisplayTable;