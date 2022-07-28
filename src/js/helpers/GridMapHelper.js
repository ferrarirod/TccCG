import * as THREE from 'three'
import { degreeToRadians } from './Util'

export class GridMapHelper {
    
    constructor(divisions = 10, divisionsColor = "rgb(0,0,0)", planeColor = "rgb(200,200,200)")
    {
        this.divisions = divisions
        this.divisionsColor = divisionsColor
        this.planeColor = planeColor
        this.initialX = (divisions - 1) * -1
        this.initialZ = (divisions - 1) * -1
        this.endX = divisions - 1
        this.endZ = divisions - 1
        this.obstacles = []
    }
    
    createGridPlane()
    {
        let planeGeometry = new THREE.PlaneGeometry(this.getMultiplier()*this.divisions,this.getMultiplier()*this.divisions,this.divisions,this.divisions)

        let grid = new THREE.GridHelper(this.getMultiplier()*this.divisions,this.divisions,this.divisionsColor,this.divisionsColor)
        grid.rotateX(degreeToRadians(90))
        grid.translateY(0.01)

        let planeMaterial = new THREE.MeshLambertMaterial({color: this.planeColor, side: THREE.DoubleSide})

        let plane = new THREE.Mesh(planeGeometry,planeMaterial)
        plane.add(grid)
        plane.receiveShadow = true
        plane.rotateX(degreeToRadians(-90))

        return plane
    }

    getGlobalXPositionFromCoord(xcoord)
    {
        let pos = this.initialX + this.getMultiplier()*xcoord
        return pos
    }

    getGlobalZPositionFromCoord(zcoord)
    {
        let pos = this.initialZ + this.getMultiplier()*zcoord
        return pos
    }

    getXCoordFromGlobalPosition(x)
    {
        let coord = Math.round((Math.round(x) - this.initialX)/this.getMultiplier())
        return coord
    }

    getZCoordFromGlobalPosition(z)
    {
        let coord = Math.round((Math.round(z) - this.initialZ)/this.getMultiplier())
        return coord   
    }

    getMultiplier()
    {
        return 2
    }

    borderXOfMap(x)
    {
        if(this.getXCoordFromGlobalPosition(x) >= 0 && this.getXCoordFromGlobalPosition(x) <= this.getXCoordFromGlobalPosition(this.endX))
        {
            return false
        }
        else
        {
            return true
        }
    }

    borderZOfMap(z)
    {
        if(this.getXCoordFromGlobalPosition(z) >= 0 && this.getXCoordFromGlobalPosition(z) <= this.getXCoordFromGlobalPosition(this.endZ))
        {
            return false
        }
        else
        {
            return true
        }   
    }

    borderMapCollision(position)
    {
        if(this.borderXOfMap(position.x)||this.borderZOfMap(position.z))
        {
            return true
        }
        else
        {
            return false
        }
    }

    addObstacle(minX,maxX,minZ,maxZ)
    {
        this.obstacles.push(
            {
                minX: minX,
                maxX: maxX,
                minZ: minZ,
                maxZ: maxZ
            }
        )
    }

    obstacleCollision(position,obstacle)
    {
        let positionXCoord = this.getXCoordFromGlobalPosition(position.x)
        let positionZCoord = this.getZCoordFromGlobalPosition(position.z)

        console.log([positionXCoord,positionZCoord])
        if((positionXCoord < obstacle.minX || positionZCoord < obstacle.minZ) || (positionXCoord > obstacle.maxX || positionZCoord > obstacle.maxZ))
        {
            return false
        }
        else
        {
            return true
        }
    }

    collisionTests(position)
    {
        if(!this.borderMapCollision(position))
        {
            let result
            for(let i = 0;i < this.obstacles.length;i++)
            {
                result = this.obstacleCollision(position,this.obstacles[i])
                if(result)
                {
                    return result
                }
            }
            
            return result
        }
        else
        {
            return true
        }
    }

}