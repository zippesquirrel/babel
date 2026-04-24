import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
const pos2 = new THREE.Vector3(0,0,70);
camera.position.set(pos2.x,pos2.y,pos2.z);
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();

const material = new THREE.LineDashedMaterial( { color: 0x8a8aff});

const points = [];
points.push(new THREE.Vector3( -10, 0, 0))
points.push(new THREE.Vector3( 0, 10, 0))
points.push(new THREE.Vector3( 10, 0, 0))

const geometry = new THREE.BufferGeometry().setFromPoints( points);

const line = new THREE.Line(geometry, material);

scene.add (line);
renderer.render(scene, camera);