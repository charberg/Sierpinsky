var width;
var height;
var length;
var maxDepth = 5;
var depth = 0;


$(document).ready(function () {
    init();


});

function init() {

    canvas = document.getElementById("triCanvas");
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

    //Calculate triangle line length
    length = height/Math.sin(60*Math.PI/180)    //Parameter conversion to radians

    t = new Triangle(new Point(0, height), new Point(width, height), new Point(width/2, 0));
    sketchTriangle(t);
    //Recursively draw children triangles
    drawSubTriangles(t);

}

function drawTriangle(t) {

    context.beginPath();
    context.moveTo(t.p1.x, t.p1.y);
    context.lineTo(t.p2.x, t.p2.y);
    context.lineTo(t.p3.x, t.p3.y);
    //context.lineTo(p1.x, p3.y);
    context.closePath();

}

function drawSubTriangles(t) {
    console.log(depth);
    //End condition, bounded by maximum recursion depth
    if(depth == maxDepth) {
        console.log("Hit max depth");
        return;
    }

    depth = depth + 1;

    //Sub triangle lengths are half of parent triangle
    subLength = length/depth;

    var midPoint1 = getCenter(t.p1, t.p2);
    var midPoint2 = getCenter(t.p2, t.p3);
    var midPoint3 = getCenter(t.p3, t.p1);

    midTriangle = new Triangle(midPoint1, midPoint2, midPoint3);

    sketchTriangle(midTriangle)

    //Recursive call to continue drawing children triangles until max depth
    drawSubTriangles(new Triangle(t.p1, midPoint1, midPoint3), depth);
    drawSubTriangles(new Triangle(midPoint3, midPoint2, t.p3), depth);
    drawSubTriangles(new Triangle(midPoint1, t.p2, midPoint2), depth);
    depth = depth -1;
}


function fillTriangle(t) {

    context.save;
    drawTriangle(t);
    context.fill();
    context.restore();

}

function sketchTriangle(t) {
    context.save;
    drawTriangle(t);
    context.stroke();
    context.restore();
}

function getCenter(p1, p2) {
    return new Point((p1.x + p2.x)/2, (p1.y + p2.y)/2);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Triangle(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
}