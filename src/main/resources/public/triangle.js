var width = 300;
var height = 300;
var length;
var maxDepth = 5;
var depth = 0;
var svg;
var div;

$(document).ready(function () {
    //init();



    var ns = 'http://www.w3.org/2000/svg'
    div = document.getElementById('drawing')
    svg = document.createElementNS(ns, 'svg')
    svg.setAttributeNS(null, 'id', 'svg-id')
    svg.setAttributeNS(null, 'width', '100%')
    svg.setAttributeNS(null, 'height', '100%')
    div.appendChild(svg)

    /*var rect = document.createElementNS(ns, 'rect')
    rect.setAttributeNS(null, 'width', 100)
    rect.setAttributeNS(null, 'height', 100)
    rect.setAttributeNS(null, 'fill', '#f06')
    svg.appendChild(rect)*/

    init();

    //Enable zoom/pan
    var test = svgPanZoom('#svg-id', {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0
    });




});

function init() {



    //Calculate triangle line length
    length = height/Math.sin(60*Math.PI/180)    //Parameter conversion to radians

    t = new Triangle(new Point(0, height), new Point(width, height), new Point(width/2, 0));
    sketchTriangle(t);
    //Recursively draw children triangles
    drawSubTriangles(t);

}

function drawLine(p1, p2) {

    var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    aLine.setAttribute('x1', p1.x);
    aLine.setAttribute('y1', p1.y);
    aLine.setAttribute('x2', p2.x);
    aLine.setAttribute('y2', p2.y);
    aLine.setAttribute('stroke', "black");
    aLine.setAttribute('stroke-width', 1);
    svg.appendChild(aLine);

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



function sketchTriangle(t) {
    drawLine(t.p1, t.p2);
    drawLine(t.p2, t.p3);
    drawLine(t.p3, t.p1);
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