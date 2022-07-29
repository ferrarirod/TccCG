import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GridMapHelper } from '../../helpers/GridMapHelper'
import { degreeToRadians,resizeCanvasToDisplaySize } from '../../helpers/Util'
import {editor,readOnlyState} from '../../components/global/editor'

var cancelExecution = false

const functionFilter = [
    {
        filter: new RegExp('^andarFrente(\\s+)?\\((\\s+)?\\d+(\\s+)?\\)(\\s+)?(;)?$'),
        type: 'sequential'
    },
    {
        filter: new RegExp('^andarTras(\\s+)?\\((\\s+)?\\d+(\\s+)?\\)(\\s+)?(;)?$'),
        type: 'sequential'
    },
    {
        filter: new RegExp('^girarEsquerda(\\s+)?\\((\\s+)?\\)(\\s+)?(;)?$'),
        type: 'sequential'
    },
    {
        filter: new RegExp('^girarDireita(\\s+)?\\((\\s+)?\\)(\\s+)?(;)?$'),
        type: 'sequential'
    },
    {
        filter: new RegExp('^if(\\s+)?\\((\\s+)?.+\\)$'),
        type: 'normal'
    },
    {
        filter: new RegExp('^if(\\s+)?\\((\\s+)?.+\\)(\\s+)?{$'),
        type: 'blockValidation'
    },
    {
        filter: new RegExp('^contemEsfera(\\s+)?\\((\\s+)?\\)(\\s+)?(;)?$'),
        type: 'normal'
    },
    {
        filter: new RegExp('^{$'),
        type: 'blockValidation'
    },
    {
        filter: new RegExp('^removeEsfera(\\s+)?\\((\\s+)?\\)(\\s+)?(;)?$'),
        type: 'normal'
    },
    {
        filter: new RegExp('^}$'),
        type: 'normal'
    },
]

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, 2, 1, 1000)
camera.position.set(0,15,30)

const renderer = new THREE.WebGLRenderer({canvas: document.getElementById("sceneView")})

window.addEventListener( 'resize', function(){
    resizeCanvasToDisplaySize(renderer,camera);
}, false );

const ambientLight = new THREE.HemisphereLight('white','darkslategrey',0.5)

const mainLight = new THREE.DirectionalLight('white',0.7)
mainLight.position.set(2,1,1)

const controls = new OrbitControls(camera, renderer.domElement)

const gridMapHelper = new GridMapHelper()

const plane = gridMapHelper.createGridPlane()

const coneGeometry = new THREE.ConeGeometry(1,2)
const coneMaterial = new THREE.MeshLambertMaterial({color: "rgb(255,0,0)"})
const cone = new THREE.Mesh(coneGeometry, coneMaterial)
cone.rotateX(degreeToRadians(90))
const actor = new THREE.Object3D()
actor.add(cone)
actor.position.set(gridMapHelper.getGlobalXPositionFromCoord(0),1.0,gridMapHelper.getGlobalZPositionFromCoord(5))
actor.rotateY(degreeToRadians(90))
console.log(actor.rotation)

const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshLambertMaterial({color: "rgb(0,0,255)"})
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
sphere.position.set(gridMapHelper.getGlobalXPositionFromCoord(8),1.0,gridMapHelper.getGlobalZPositionFromCoord(2))

scene.add(ambientLight)
scene.add(mainLight)
scene.add(plane)
scene.add(sphere)
scene.add(actor)

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

function andarFrente(amount)
{
    let objectCopy = actor.clone()
    objectCopy.translateZ(gridMapHelper.getMultiplier()*amount)
    let newPosition = objectCopy.position
    let requestID
    let alpha = 0.01
    return new Promise(function(resolve){
        function translateActor()
        {
            let collision = gridMapHelper.collisionTests(actor.position)
            if((actor.position.x.toFixed(2) != newPosition.x.toFixed(2)||actor.position.z.toFixed(2) != newPosition.z.toFixed(2)) && !cancelExecution && !collision)
            {
                actor.position.lerp(newPosition,alpha)
                alpha += 0.001
                requestID = requestAnimationFrame(translateActor)
            }
            else
            {
                if(collision)
                {
                    printOnConsole("Não há como prosseguir por esse caminho.")
                    cancelExecution = true
                }
                cancelAnimationFrame(requestID)
                objectCopy.children[0].geometry.dispose()
                objectCopy.children[0].material.dispose()
                resolve()
            }
        }
        
        requestID = requestAnimationFrame(translateActor)
    })
}

function andarTras(amount)
{
    let objectCopy = actor.clone()
    objectCopy.translateZ(-(gridMapHelper.getMultiplier()*amount))
    let newPosition = objectCopy.position
    let requestID
    let alpha = 0.01
    return new Promise(function(resolve){
        function translateActor()
        {
            let collision = gridMapHelper.collisionTests(actor.position)
            if((actor.position.x.toFixed(2) != newPosition.x.toFixed(2)||actor.position.z.toFixed(2) != newPosition.z.toFixed(2)) && !cancelExecution && !collision)
            {
                actor.position.lerp(newPosition,alpha)
                alpha += 0.001
                requestID = requestAnimationFrame(translateActor)
            }
            else
            {
                if(collision)
                {
                    printOnConsole("Não há como prosseguir por esse caminho.")
                    cancelExecution = true
                }
                cancelAnimationFrame(requestID)
                objectCopy.children[0].geometry.dispose()
                objectCopy.children[0].material.dispose()
                resolve()
            }
        }
        
        requestID = requestAnimationFrame(translateActor)
    })
}

function girarDireita()
{
    let objectCopy = actor.clone()
    objectCopy.rotateY(degreeToRadians(-90))
    let newPosition = new THREE.Quaternion()
    newPosition.setFromEuler(objectCopy.rotation)
    let requestID
    return new Promise(function(resolve){
        function rotateActor()
        {
            if(!actor.quaternion.equals(newPosition) && !cancelExecution)
            {
                actor.quaternion.rotateTowards(newPosition,degreeToRadians(1))
                requestID = requestAnimationFrame(rotateActor)
            }
            else
            {
                cancelAnimationFrame(requestID)
                objectCopy.children[0].geometry.dispose()
                objectCopy.children[0].material.dispose()
                resolve()
            }
        }

        requestID = requestAnimationFrame(rotateActor)
    })
}

function girarEsquerda()
{
    let objectCopy = actor.clone()
    objectCopy.rotateY(degreeToRadians(90))
    let newPosition = new THREE.Quaternion()
    newPosition.setFromEuler(objectCopy.rotation.clone())
    let requestID
    return new Promise(function(resolve){
        function rotateActor()
        {
            if(!actor.quaternion.equals(newPosition) && !cancelExecution)
            {
                actor.quaternion.rotateTowards(newPosition,degreeToRadians(1))
                requestID = requestAnimationFrame(rotateActor)
            }
            else
            {
                cancelAnimationFrame(requestID)
                objectCopy.children[0].geometry.dispose()
                objectCopy.children[0].material.dispose()
                resolve()
            }
        }

        requestID = requestAnimationFrame(rotateActor)
    })
}

function checkCollision(object1,object2)
{
    if(gridMapHelper.getXCoordFromGlobalPosition(object1.position.x) == gridMapHelper.getXCoordFromGlobalPosition(object2.position.x) && gridMapHelper.getZCoordFromGlobalPosition(object1.position.z) == gridMapHelper.getZCoordFromGlobalPosition(object2.position.z))
    {
        return true
    }
    else
    {
        return false
    }
}

function contemEsfera()
{
    if(cancelExecution)
    {
        return
    }
    let result = checkCollision(actor,sphere)
    
    if(!result)
    {
        printOnConsole("Esfera não encontrada")
    }

    return result
}

function removeEsfera()
{
    if(cancelExecution)
    {
        return
    }

    if(checkCollision(actor,sphere))
    {
        sphere.visible = false
        printOnConsole("Esfera removida.")
    }
    else
    {
        printOnConsole("Objeto não está sobre a esfera.")
    }
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

function resetLevel()
{
    actor.position.set(gridMapHelper.getGlobalXPositionFromCoord(0),1.0,gridMapHelper.getGlobalZPositionFromCoord(5))
    actor.rotation.set(0,degreeToRadians(90),0)
    sphere.visible = true
}

function winCondition()
{
    if(checkCollision(actor,sphere) && !sphere.visible)
    {
        return true
    }
    else
    {
        return false
    }
}

const execBtn = document.getElementById("execute")
execBtn.addEventListener("click",async function(){
    let codeParsed = parseCode(editor.state.doc.toString())
    cancelExecution = false
    if(codeParsed != null)
    {
        resetLevel()
        document.getElementById("execute").disabled = true
        await eval(codeParsed)
        if(winCondition())
        {
            readOnlyState.doc = editor.state.doc
            editor.setState(readOnlyState)
            document.getElementById('winMessage').classList.remove('invisible')
            document.getElementById('advanceBtn').classList.remove('invisible')
            document.getElementById("reset").disabled = true
        }
        else
        {
            document.getElementById("execute").disabled = false
        }
    }
})

const resetBtn = document.getElementById("reset")
resetBtn.addEventListener("click",function(){
    cancelExecution = true
    resetLevel()
})

const clsConsoleBtn = document.getElementById("clsConsole")
clsConsoleBtn.addEventListener("click",function(){
    document.getElementById("console-printing").innerHTML = null
})

resizeCanvasToDisplaySize(renderer,camera)
animate()