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
        filter: new RegExp('^girarEsquerda\\(\\)$'),
        type: 'sequential'
    },
    {
        filter: new RegExp('^girarDireita\\(\\)$'),
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
        filter: new RegExp('^contemEsfera\\(\\)$'),
        type: 'normal'
    },
    {
        filter: new RegExp('^{$'),
        type: 'blockValidation'
    },
    {
        filter: new RegExp('^removeEsfera\\(\\)$'),
        type: 'normal'
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
const grid = new THREE.GridHelper(20,10,"rgb(0,0,0)","rgb(0,0,0)")
grid.rotateX(90 * (Math.PI/180))
grid.translateY(0.01)
const planeMaterial = new THREE.MeshLambertMaterial({color: "rgb(200,200,200)", side: THREE.DoubleSide})
const plane = new THREE.Mesh(planeGeometry,planeMaterial)
plane.add(grid)
plane.receiveShadow = true
plane.matrixAutoUpdate = false
plane.matrix.identity()
plane.matrix.multiply(mat4.makeTranslation(0.0,0.0,0.0))
plane.matrix.multiply(mat4.makeRotationX(-90 * (Math.PI/180)))

const coneGeometry = new THREE.ConeGeometry(1,2)
const coneMaterial = new THREE.MeshLambertMaterial({color: "rgb(255,0,0)"})
const cone = new THREE.Mesh(coneGeometry, coneMaterial)
cone.rotateX(90 * (Math.PI/180))
const cube = new THREE.Object3D()
cube.add(cone)
cube.position.set(-9.0,1.0,-9.0)

const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshLambertMaterial({color: "rgb(0,0,255)"})
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
sphere.position.set(5.0,1.0,3.0)

scene.add(ambientLight)
scene.add(mainLight)
scene.add(plane)
scene.add(sphere)
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

function andarFrente(amount)
{
    let objectCopy = cube.clone()
    objectCopy.translateZ(2*amount)
    let newPosition = objectCopy.position
    let requestID
    return new Promise(function(resolve){
        function translateCube()
        {
            if(cube.position.x.toFixed(2) != newPosition.x.toFixed(2)||cube.position.y.toFixed(2) != newPosition.y.toFixed(2)||cube.position.z.toFixed(2) != newPosition.z.toFixed(2))
            {
                cube.position.lerp(newPosition,0.05)
                requestID = requestAnimationFrame(translateCube)
            }
            else
            {
                cancelAnimationFrame(requestID)
                objectCopy.children[0].geometry.dispose()
                objectCopy.children[0].material.dispose()
                resolve()
            }
        }
        
        requestID = requestAnimationFrame(translateCube)
    })
}

function andarTras(amount)
{
    let objectCopy = cube.clone()
    objectCopy.translateZ(-2*amount)
    let newPosition = objectCopy.position
    let requestID
    return new Promise(function(resolve){
        function translateCube()
        {
            if(cube.position.x.toFixed(2) != newPosition.x.toFixed(2)||cube.position.y.toFixed(2) != newPosition.y.toFixed(2)||cube.position.z.toFixed(2) != newPosition.z.toFixed(2))
            {
                cube.position.lerp(newPosition,0.05)
                requestID = requestAnimationFrame(translateCube)
            }
            else
            {
                cancelAnimationFrame(requestID)
                objectCopy.children[0].geometry.dispose()
                objectCopy.children[0].material.dispose()
                resolve()
            }
        }
        
        requestID = requestAnimationFrame(translateCube)
    })
}

function girarDireita()
{
    let objectCopy = cube.clone()
    objectCopy.rotateY(90 * (Math.PI/180))
    let newPosition = new THREE.Quaternion()
    newPosition.setFromEuler(objectCopy.rotation)
    let requestID
    return new Promise(function(resolve){
        function rotateCube()
        {
            if(!cube.quaternion.equals(newPosition))
            {
                cube.quaternion.rotateTowards(newPosition,1 * (Math.PI/180))
                requestID = requestAnimationFrame(rotateCube)
            }
            else
            {
                cancelAnimationFrame(requestID)
                objectCopy.children[0].geometry.dispose()
                objectCopy.children[0].material.dispose()
                resolve()
            }
        }

        requestID = requestAnimationFrame(rotateCube)
    })
}

function girarEsquerda()
{
    let objectCopy = cube.clone()
    objectCopy.rotateY(-90 * (Math.PI/180))
    let newPosition = new THREE.Quaternion()
    newPosition.setFromEuler(objectCopy.rotation.clone())
    let requestID
    return new Promise(function(resolve){
        function rotateCube()
        {
            if(!cube.quaternion.equals(newPosition))
            {
                cube.quaternion.rotateTowards(newPosition,1 * (Math.PI/180))
                requestID = requestAnimationFrame(rotateCube)
            }
            else
            {
                cancelAnimationFrame(requestID)
                objectCopy.children[0].geometry.dispose()
                objectCopy.children[0].material.dispose()
                resolve()
            }
        }

        requestID = requestAnimationFrame(rotateCube)
    })
}

function checkCollision(object1,object2)
{
    object1.geometry.computeBoundingBox()
    object2.geometry.computeBoundingBox()

    object1.updateMatrixWorld()
    object2.updateMatrixWorld()

    let obj1Box = object1.geometry.boundingBox.clone()
    obj1Box.applyMatrix4(object1.matrixWorld)
    let obj2Box = object2.geometry.boundingBox.clone()
    obj2Box.applyMatrix4(object2.matrixWorld)

    return obj2Box.intersectsBox(obj1Box)
}

function contemEsfera()
{
    let result = checkCollision(cube.children[0],sphere)
    
    if(!result)
    {
        printOnConsole("Esfera não encontrada")
    }

    return result
}

function removeEsfera()
{
    sphere.visible = false
    printOnConsole("Esfera removida")
}

function printOnConsole(content)
{
    let consoleToPrint = document.getElementById("console-printing")
    consoleToPrint.innerHTML += `${content}<br>`   
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
        if(lines[i].trim() != "")
        {
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
        else
        {
            continue
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
execBtn.addEventListener("click",async function(){
    let codeParsed = parseCode(editor.doc.getValue())
    if(codeParsed != null)
    {
        document.getElementById("execute").disabled = true
        document.getElementById("reset").disabled = true
        await eval(codeParsed)
        document.getElementById("execute").disabled = false
        document.getElementById("reset").disabled = false
    }
})

const resetBtn = document.getElementById("reset")
resetBtn.addEventListener("click",function(){
    cube.position.set(-9.0,1.0,-9.0)
    cube.rotation.set(0,0,0)
    sphere.visible = true
})

const clsConsoleBtn = document.getElementById("clsConsole")
clsConsoleBtn.addEventListener("click",function(){
    document.getElementById("console-printing").innerHTML = null
})

resizeCanvasToDisplaySize()
animate()