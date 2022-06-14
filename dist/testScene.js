import * as THREE from 'three'
import { OrbitControls } from './packages/three/examples/jsm/controls/OrbitControls.js'

const functionFilter = [
    {
        filter: new RegExp('^andarFrente\\(\\d+\\)$'),
        type: 'sequential'
    },
    {
        filter: new RegExp('^andarTras\\(\\d+\\)$'),
        type: 'sequential'
    },
    {
        filter: new RegExp('^andarEsquerda\\(\\d+\\)$'),
        type: 'sequential'
    },
    {
        filter: new RegExp('^andarDireita\\(\\d+\\)$'),
        type: 'sequential'
    },
    {
        filter: new RegExp('^if\\(.+\\)$'),
        type: 'normal'
    },
    {
        filter: new RegExp('^if\\(.+\\){$'),
        type: 'blockValidation'
    },
    {
        filter: new RegExp('^{$'),
        type: 'blockValidation'
    },
    {
        filter: new RegExp('^}$'),
        type: 'normal'
    },
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
    return new Promise(function(resolve){
        translateCube(cube.position,new THREE.Vector3(cube.position.x,cube.position.y,cube.position.z + amount));
        setTimeout(function(){
            return resolve()
        },1000 + 10 * amount)
    })
}

function andarTras(amount)
{
    return new Promise(function(resolve){
        translateCube(cube.position,new THREE.Vector3(cube.position.x,cube.position.y,cube.position.z - amount));
        setTimeout(function(){
            resolve()
        },1000 + 10 * amount)
    })
}

function andarDireita(amount)
{
    return new Promise(function(resolve){
        translateCube(cube.position,new THREE.Vector3(cube.position.x + amount,cube.position.y,cube.position.z));
        setTimeout(function(){
            resolve()
        },1000 + 10 * amount)
    })
}

function andarEsquerda(amount)
{
    return new Promise(function(resolve){
        translateCube(cube.position,new THREE.Vector3(cube.position.x - amount,cube.position.y,cube.position.z));
        setTimeout(function(){
            resolve()
        },1000 + 10 * amount)
    })
}

function printErrorOnConsole(content,line)
{
    let consoleToPrint = document.getElementById("console-printing")
    consoleToPrint.innerHTML += `Código Inválido:<br> ${content} linha: ${line}<br>`
}

function blockValidation(lines,index)
{
    let valid = false
    let ignoreClosure = 0
    for(let i = index + 1; i < lines.length;i++)
    {
        if(lines[i].includes('}'))
        {
            if(ignoreClosure == 0)
            {
                valid = true
                break
            }
            else
            {
                ignoreClosure--
            }
        }
        else if(lines[i].includes('{'))
        {
            ignoreClosure++
        }
    }

    return valid
}

function parseCode(code)
{
    let codeParsed = "async function runCode(){\n";
    let lines = code.split('\n')
    let valid = true
    for(let i = 0;i < lines.length;i++)
    {
        let validLine = false
        let lineType
        for(let j = 0;j < functionFilter.length;j++)
        {
            validLine = functionFilter[j].filter.test(lines[i].trim())
            if(validLine)
            {
                lineType = functionFilter[j].type   
                break
            }
        }
        if(validLine)
        {
            if(lineType === "sequential")
            {
                let lineParsed = "await " + lines[i].trim() + "\n"
                codeParsed += lineParsed
            }
            else if(lineType === 'blockValidation')
            {
                if(blockValidation(lines,i))
                {
                    let lineParsed = lines[i].trim() + "\n"
                    codeParsed += lineParsed      
                }
                else
                {
                    printErrorOnConsole(`${lines[i]} (Bloco é aberto mas nunca é fechado)`,i+1)
                    valid = false
                    break
                }
            }
            else
            {
                let lineParsed = lines[i].trim() + "\n"
                codeParsed += lineParsed   
            }
        }
        else
        {
            printErrorOnConsole(lines[i],i+1)
            valid = false
            break
        }
    }

    if(valid)
    {
        codeParsed += "}\nrunCode()"
        return codeParsed
    }
    else
    {
        return null
    }
}

const execBtn = document.getElementById("execute")
execBtn.addEventListener("click",function(){
    let codeParsed = parseCode(editor.doc.getValue())
    if(codeParsed != null)
    {
        eval(codeParsed)
    }
})

const resetBtn = document.getElementById("reset")
resetBtn.addEventListener("click",function(){
    cube.position.set(0.0,2.0,0.0)
})

const clsConsoleBtn = document.getElementById("clsConsole")
clsConsoleBtn.addEventListener("click",function(){
    document.getElementById("console-printing").innerHTML = null
})

resizeCanvasToDisplaySize()
animate()