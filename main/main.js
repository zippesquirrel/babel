import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'lil-gui'; 
const scene = new THREE.Scene();

const canvas = document.querySelector('#c');
//camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set(0, 0, 20);

// lil gui

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return '#' + this.object[this.prop].getHexString();
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

//render
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setClearColor( 0xffffff, 0);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );

// lights
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

// lil gui light interface
const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 5, 0.01);


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial({
  color: 0xFF0000,    // red (can also use a CSS color string here)
  flatShading: true,
});
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

// importing a gltf
const loader = new GLTFLoader();

loader.load( 'Spiral2.glb', function ( gltf ) {

  scene.add( gltf.scene );
  // gltf.material = material

}, undefined, function ( error ) {

  console.error( error );

} );


function animate( time ) {

  // root.rotation.y = time / 2000;
  cube.position.y = Math.sin(time/500)

  renderer.render( scene, camera );

}