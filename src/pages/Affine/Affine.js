import React, { useState, useEffect, useReducer } from 'react';
import { Canvas } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { Matrix } from 'ml-matrix';

import MatrixComponent from './MatrixComponent';
import Box from './Box';

import './affine.css';

const boxPoints = [
  -1.0, -1.0,  1.0,
  1.0, -1.0,  1.0,
  1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0, -1.0, -1.0,
  1.0, -1.0, -1.0,
  1.0, 1.0, -1.0,
  -1.0, 1.0, -1.0,
];
const boxIndices = new Uint16Array([
  0,1,2,2,3,0,
  1,5,6,6,2,1,
  5,4,7,7,6,5,
  4,0,3,3,7,4,
  4,5,1,1,0,4,
  7,3,2,2,6,7
]);

function transformReducer(state, action) {
  switch (action.type) {
    case 'add': {
      return {
        matrices: [...state.matrices, Matrix.identity(4,4)]
      };
    }
    case 'edit': {
      const arr = [...state.matrices];
      arr[action.index].set(action.i, action.j, action.value);
      return {
        matrices: arr
      };
    }
    case 'delete': {
      return {
        matrices: [...state.matrices].filter((_,i) => i !== action.index),
      };
    }
    default: {
      return state;
    }
  }
}

const Affine = () => {
  const [transforms, dispatch] = useReducer(transformReducer, {matrices: [], update: false});
  const [points, setPoints] = useState(new Float32Array(boxPoints));
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);
  const [pointsEle, setPointsEle] = useState(<></>);
  
  
  useEffect(() => {
    let ele = [<div className="points-row">{"("}<div>x</div><div>y</div><div>z</div>{")"}</div>];
    for (let i=0; i<points.length; i+=3) {
      let rowEle = [];
      for (let j=0; j<3; j++) {
        const c = String(points[i+j]).indexOf('.');
        if (c > 0) rowEle.push(<div>{String(points[i+j]).substring(0,c) + String(points[i+j]).substring(c,c+5)}</div>);
        else rowEle.push(<div>{points[i+j]}</div>)
      }
      ele.push(<div className="points-row">{"("}{rowEle}{")"}</div>);
    }
    setPointsEle(ele);
  }, [points]);

  function updatePoints() {
    let newPoints = [];
    const po = boxPoints;
    
    const rX = rotationX*Math.PI;
    const rY = rotationY*Math.PI;
    const rZ = rotationZ*Math.PI;

    const rXcos = Math.cos(rX);
    const rXsin = Math.sin(rX);

    const rYcos = Math.cos(rY);
    const rYsin = Math.sin(rY);

    const rZcos = Math.cos(rZ);
    const rZsin = Math.sin(rZ);

    const rotX = new Matrix([[1,0,0,0],[0,rXcos,-1*rXsin,0],[0,rXsin,rXcos,0],[0,0,0,1]]);
    const rotY = new Matrix([[rYcos,0,rYsin,0],[0,1,0,0],[-1*rYsin,0,rYcos,0],[0,0,0,1]]);
    const rotZ = new Matrix([[rZcos,-1*rZsin,0,0],[rZsin,rZcos,0,0],[0,0,1,0],[0,0,0,1]]);

    const c = transforms.matrices.reduce((m, x) => m.mmul(x), Matrix.identity(4,4)).mmul(rotX).mmul(rotY).mmul(rotZ);

    for (let i=0; i<points.length; i+=3) {
      const p = new Matrix([[po[i]],[po[i+1]],[po[i+2]],[1]]);
      
      let vec = c.mmul(p).getColumn(0);
      newPoints.push(vec[0], vec[1], vec[2]);
    }
    setPoints(new Float32Array(newPoints));
  }

  useEffect(() => {
    updatePoints();
    // eslint-disable-next-line
  }, [transforms]);
  
  return (
    <div className="App">
      <div className="canvas-container">
        <Canvas linear={true}>
          <CameraControls />
          <ambientLight intensity={1} />
          <axesHelper args={[5]}/>
          <Box indices={boxIndices} points={points} />
        </Canvas>
      </div>
      <div className="options">
        <div>
          Vertices
          <div className="points-display">
            {pointsEle}
          </div>
        </div>
        <div>
          <button onClick={() => { dispatch({ type: 'add' }) }}>Add Transform</button>
        </div>
        {
          transforms.matrices.map((t, i) =>
          <div key={`matrix-component-${i}`} className="matrix-component-container">
            Transform {i+1}
            <MatrixComponent matrix={t} setMatrix={(Mi, Mj, val) => {
              dispatch({
                type: 'edit',
                index: i,
                i: Mi,
                j: Mj,
                value: val
              });
            }} deleteMatrix={() => {dispatch({ type: 'delete', index: i })}} canEdit={true} />
          </div>)
        }
        <div>
          Rotation (order: x, y, z)<br/>
          <input type="range" defaultValue="0" step="0.1" min={-2} max={2} onChange={(e) => {setRotationX(e.target.value); updatePoints(); }}/> X: {rotationX}pi rad
          <input type="range" defaultValue="0" step="0.1" min={-2} max={2} onChange={(e) => {setRotationY(e.target.value); updatePoints(); }}/> Y: {rotationY}pi rad
          <input type="range" defaultValue="0" step="0.1" min={-2} max={2} onChange={(e) => {setRotationZ(e.target.value); updatePoints(); }}/> Z: {rotationZ}pi rad
        </div>
        <div>
          <a href="https://people.computing.clemson.edu/~dhouse/courses/401/notes/affines-matrices.pdf">Reference</a>
        </div>
      </div>
    </div>
  );
}


export default Affine;