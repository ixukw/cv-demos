import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import './matrixcomponent.css';

const MatrixComponent = ({ matrix, setMatrix, deleteMatrix, canEdit }) => {
    const [matrixEle, setMatrixEle] = useState(<></>);
    useEffect(() => {
        let ele = [];
        for (let i=0; i<4; i++) {
            let nested = [];
            for (let j=0; j<4; j++) {
                if (canEdit) {
                    nested.push(
                    <input
                        key={uuid()}
                        className="matrix-num"
                        type="number"
                        step="0.1"
                        defaultValue={matrix.get(i,j)}
                        id={`${i},${j}`}
                        onChange={e => setMatrix(i,j,parseFloat(e.target.value))}
                    />);
                } else {
                    nested.push(<div key={uuid()} className="matrix-num">{matrix.get(i,j)}</div>)
                }
            }
            ele.push(<div key={uuid()} className="matrix-row">{nested}</div>);
        }
        setMatrixEle(ele);
    // eslint-disable-next-line
    }, []);

    return (
        <div className="matrix-component">
            <div>{matrixEle}</div>
            {canEdit && <button onClick={deleteMatrix}>Delete</button>}
        </div>
    )
}
export default MatrixComponent;