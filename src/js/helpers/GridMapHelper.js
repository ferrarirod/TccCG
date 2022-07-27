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
        let coord = (Math.round(x) - this.initialX)/this.getMultiplier()
        return coord
    }

    getZCoordFromGlobalPosition(z)
    {
        let coord = (Math.round(z) - this.initialZ)/this.getMultiplier()
        return coord   
    }

    getMultiplier()
    {
        return 2
    }

    borderXOfMap(x)
    {
        if(this.getXCoordFromGlobalPosition(x) > 0 && this.getXCoordFromGlobalPosition(x) < this.getXCoordFromGlobalPosition(this.endX))
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
        if(this.getXCoordFromGlobalPosition(z) > 0 && this.getXCoordFromGlobalPosition(z) < this.getXCoordFromGlobalPosition(this.endZ))
        {
            return false
        }
        else
        {
            return true
        }   
    }

    borderMapCollision(position,newPosition)
    {
        if((this.borderXOfMap(position.x) && this.borderXOfMap(newPosition.x))||(this.borderZOfMap(position.z) && this.borderXOfMap(newPosition.z)))
        {
            return true
        }
        else
        {
            return false
        }
    }
}