import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

const Box = ({ indices, points }) => {
    const [update, setUpdate] = useState(false);
    const bufferGeoRef = useRef();
    const edgesRef = useRef();

    useFrame(() => {
        if (bufferGeoRef.current && update) {
            const pos = bufferGeoRef.current.getAttribute('position');
            for (let i = 0; i <= points.length; i++) {
                pos.array[i] = points[i];
            }
            
            bufferGeoRef.current.setAttribute('position', pos);
            edgesRef.current.geometry = new THREE.EdgesGeometry(bufferGeoRef.current);

            bufferGeoRef.current.attributes.position.needsUpdate = true;
            edgesRef.current.geometry.attributes.position.needsUpdate = true;
            setUpdate(false);
        }
    });

    useEffect(() => {
        setUpdate(true);
    }, [points])

    return (
        <mesh>
            <bufferGeometry ref={bufferGeoRef}>
                <bufferAttribute attach='attributes-position' array={points} itemSize={3} count={points.length / 3} />
                <bufferAttribute attach='index' array={indices} itemSize={1} count={indices.length}/>
            </bufferGeometry>
            <meshBasicMaterial color='blue' transparent={true} opacity={0.5} side={0}/>
            <Edges ref={edgesRef} thickness={0.05} color="black" />
        </mesh>
    )
}
export default Box;