import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        initBasicMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // variables 
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = initBasicMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.
var clock = new THREE.Clock();

// Listen window size changes
window.addEventListener( 'resize', function(){
  camera.aspect = window.innerWidth*0.5 / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth*0.5, window.innerHeight );
}, false );
camera.aspect = window.innerWidth*0.5 / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize( window.innerWidth*0.5, window.innerHeight );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
let cube = new THREE.Mesh(cubeGeometry, material);
// position the cube
cube.position.set(0.0, 2.0, 0.0);
// add the cube to the scene
scene.add(cube);

// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

render();

function render()
{
  var execBtn = document.getElementById("execute");
  execBtn.onclick = function() {executeCommand()}
  var resetBtn = document.getElementById("reset");
  resetBtn.addEventListener("click",function(){
      resetPosition();
  });
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}

function andarFrente(amount)
{
    translate(cube.position,new THREE.Vector3(cube.position.x,cube.position.y,cube.position.z + amount));
}

function andarTras(amount)
{
  translate(cube.position,new THREE.Vector3(cube.position.x,cube.position.y,cube.position.z - amount));
}

function andarDireita(amount)
{
  translate(cube.position,new THREE.Vector3(cube.position.x + amount,cube.position.y,cube.position.z));
}

function andarEsquerda(amount)
{
  translate(cube.position,new THREE.Vector3(cube.position.x - amount,cube.position.y,cube.position.z));
}

function executeCommand()
{
    var code = document.getElementById("codeToExecute");
    eval(code.value);
}

function resetPosition()
{
  cube.position.set(0.0, 2.0, 0.0);
}

function translate(initPos,finalPos)
{
  if(initPos.x.toFixed(0) != finalPos.x.toFixed(0) || initPos.y.toFixed(0) != finalPos.y.toFixed(0) || initPos.z.toFixed(0) != finalPos.z.toFixed(0))
  {
    cube.position.lerp(finalPos,0.05);
    window.requestAnimationFrame(function(){
      translate(cube.position,finalPos);
    });
  }
}