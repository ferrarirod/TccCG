import * as THREE from 'three'
import { OrbitControls } from './packages/three/examples/jsm/controls/OrbitControls.js'

const functionFilter = [
    new RegExp('^andarFrente\\(\\d+\\)$'),
    new RegExp('^andarTras\\(\\d+\\)$'),
    new RegExp('^andarEsquerda\\(\\d+\\)$'),
    new RegExp('^andarDireita\\(\\d+\\)$'),
]

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

function translateCube(initPos,finalPos)
{
    if(initPos.x.toFixed(0) != finalPos.x.toFixed(0) || initPos.y.toFixed(0) != finalPos.y.toFixed(0) || initPos.z.toFixed(0) != finalPos.z.toFixed(0))
    {
        cube.position.lerp(finalPos,0.05);
        requestAnimationFrame(function(){
            translateCube(cube.position,finalPos)
        })
    }
}

function andarFrente(amount)
{
    translateCube(cube.position,new THREE.Vector3(cube.position.x,cube.position.y,cube.position.z + amount));
    return amount
}

function andarTras(amount)
{
    translateCube(cube.position,new THREE.Vector3(cube.position.x,cube.position.y,cube.position.z - amount));
    return amount
}

function andarDireita(amount)
{
    translateCube(cube.position,new THREE.Vector3(cube.position.x + amount,cube.position.y,cube.position.z));
    return amount
}

function andarEsquerda(amount)
{
    translateCube(cube.position,new THREE.Vector3(cube.position.x - amount,cube.position.y,cube.position.z));
    return amount
}

function parseCode()
{
    let valid = false
    let code  = document.getElementById("codeToExecute").value
    let lines = code.split('\n')
    let lineObjs = []

    for(let i = 0; i < lines.length;i++)
    {
        let validLine = false
        for(let j = 0; j < functionFilter.length;j++)
        {
            validLine = functionFilter[j].test(lines[i].normalize())
            if(validLine)
            {
                break
            }
        }
        let lineObj = {
            code: lines[i],
            valid: validLine
        }
        lineObjs.push(lineObj)
    }

    for(let i = 0;i < lineObjs.length;i++)
    {
        if(!lineObjs[i].valid)
        {
            valid = false
            break
        }
        else
        {
            valid = true
        }
    }

    return [valid,lineObjs]
}

function readLineCodeFromString(line)
{
    return new Promise(function(resolve){
        let timeMultiplier = eval(line)
        setTimeout(function(){
            resolve()
        },1000 + 10*timeMultiplier)
    })
}

async function readParsedCode(parsedCode)
{
    let valid = parsedCode[0]
    let lineObjs = parsedCode[1]

    if(valid)
    {
        let i = 0
        while(i < lineObjs.length)
        {
            await readLineCodeFromString(lineObjs[i].code)
            i++
        }
    }
    else
    {
        console.log("Código inválido:")
        for(let i = 0; i < lineObjs.length;i++)
        {
            if(!lineObjs[i].valid)
            {
                console.log(`${lineObjs[i].code} linha:${i+1}`)
            }
        }
    }
}

const execBtn = document.getElementById("execute")
execBtn.addEventListener("click",function(){
    readParsedCode(parseCode())
})

const resetBtn = document.getElementById("reset")
resetBtn.addEventListener("click",function(){
    cube.position.set(0.0,2.0,0.0)
})

resizeCanvasToDisplaySize()
animate()