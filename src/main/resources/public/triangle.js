var width = 300;
var height = 300;
var length;
var maxInitDepth = 5;
var maxDepth = 5;
var zoomDepth = 0;
var depth = 0;
var svg;
var svgg;  /* Top <g> element inside svg */
var div;

//2D array of triangles, where first index is their recursive depth at an offset
var triangles;
var zoomCount = 0;

$(document).ready(function () {
    //init();

    var ns = 'http://www.w3.org/2000/svg'
    div = document.getElementById('drawing')
    svg = document.createElementNS(ns, 'svg')
    svg.setAttributeNS(null, 'id', 'svg-id')
    svg.setAttributeNS(null, 'width', '100%')
    svg.setAttributeNS(null, 'height', '100%')
    svgg = document.createElementNS(ns, 'g')
    svg.appendChild(svgg)
    div.appendChild(svg)

    init();
    enableZoomPan();
});

function init() {

    triangles = create2DArray(5);

    //Calculate triangle line length
    length = height/Math.sin(60*Math.PI/180)    //Parameter conversion to radians

    t = new Triangle(new Point(0, height), new Point(width, height), new Point(width/2, 0));
    sketchTriangle(t);
    //Recursively draw children triangles
    drawSubTriangles(t, true);
    attachMouseWheelListener();

}

function enableZoomPan() {
    //Enable zoom/pan
    var test = svgPanZoom('#svg-id', {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0
    });
}

function attachMouseWheelListener() {
    if (div.addEventListener)
    {
        // IE9, Chrome, Safari, Opera
        div.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        div.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
// IE 6/7/8
    else
    {
        div.attachEvent("onmousewheel", MouseWheelHandler);
    }

    function MouseWheelHandler(e)
    {
        // cross-browser wheel delta
        var e = window.event || e; // old IE support
        //Delta +1 -> scrolled up
        //Delta -1 -> scrolled down
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        zoomCount = zoomCount + delta;
        if(zoomCount%15 == 0 && delta == 1) {
            for(var i = 0; i < triangles[0].length; i++) {
                drawSubTriangles(triangles[zoomDepth][i], false);
            }
            zoomDepth++;
            enableZoomPan();
        }
        return false;
    }
}


function drawLine(p1, p2) {

    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', "black");
    line.setAttribute('stroke-width', 1);
    svgg.appendChild(line);

}

//Recursive parameter if you want to draw recursively, or just stop after one level
function drawSubTriangles(t, recursive) {
    //End condition, bounded by maximum recursion depth
    if(depth == maxDepth && recursive == true) {
        //Push triangle to depth collection, to track in case zooming in and redrawing
        triangles[zoomDepth].push(t);
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

    if(recursive == false) {
        triangles[zoomDepth+1].push(midTriangle);
    }

    //Recursive call to continue drawing children triangles until max depth
    if(recursive == true) {
        drawSubTriangles(new Triangle(t.p1, midPoint1, midPoint3), true);
        drawSubTriangles(new Triangle(midPoint3, midPoint2, t.p3), true);
        drawSubTriangles(new Triangle(midPoint1, t.p2, midPoint2), true);
    }
    depth = depth -1;
}



function sketchTriangle(t) {
    drawLine(t.p1, t.p2);
    drawLine(t.p2, t.p3);
    drawLine(t.p3, t.p1);
}

function create2DArray(rows) {
    var arr = [];

    for (var i=0;i<rows;i++) {
        arr[i] = [];
    }

    return arr;
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