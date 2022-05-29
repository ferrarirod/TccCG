import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'

const mat4 = new THREE.Matrix4()

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, 2, 1, 1000)
camera.position.set(0,15,30)

const renderer = new THREE.WebGLRenderer({canvas: document.getElementById("sceneView")})

window.addEventListener( 'resize', function(){
    resizeCanvasToDisplaySize();
}, false );

const ambientLight = new THREE.HemisphereLight('white','darkslategrey',0.5)

const mainLight = new THREE.DirectionalLight('white',0.7)
mainLight.position.set(2,1,1)

const controls = new OrbitControls(camera, renderer.domElement)

const planeGeometry = new THREE.PlaneGeometry(20,20,10,10)
const planeMaterial = new THREE.MeshLambertMaterial({color: "rgb(200,200,200)", side: THREE.DoubleSide})
const plane = new THREE.Mesh(planeGeometry,planeMaterial)
plane.receiveShadow = true
plane.matrixAutoUpdate = false
plane.matrix.identity()
plane.matrix.multiply(mat4.makeTranslation(0.0,-0.1,0.0))
plane.matrix.multiply(mat4.makeRotationX(-90 * (Math.PI/180)))

const cubeGeometry = new THREE.BoxGeometry(4,4,4)
const cubeMaterial = new THREE.MeshLambertMaterial({color: "rgb(255,0,0)"})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.set(0.0,2.0,0.0)

scene.add(ambientLight)
scene.add(mainLight)
scene.add(plane)
scene.add(cube)

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
}

function render() {
    renderer.render(scene, camera)
}

function resizeCanvasToDisplaySize() 
{
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if(canvas.width !== width ||canvas.height !== height) 
    {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

resizeCanvasToDisplaySize()
animate()