

export function degreeToRadians(angle)
{
    let radianAngle = angle * (Math.PI/180) 
    return radianAngle
}

export function resizeCanvasToDisplaySize(renderer,camera)
{
    let canvas = renderer.domElement;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    if(canvas.width !== width ||canvas.height !== height) 
    {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}