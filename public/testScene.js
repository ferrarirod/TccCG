import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(70, 2, 1, 1000)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer({canvas: document.getElementById("sceneView")})

window.addEventListener( 'resize', function(){
    resizeCanvasToDisplaySize();
}, false );

const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
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