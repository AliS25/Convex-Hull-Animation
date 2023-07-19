const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;


// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate. The `compareTo` function
// implements a comparison for sorting with respect to x-coordinates,
// breaking ties by y-coordinate.
function Point (x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;

    // Compare this Point to another Point p for the purposes of
    // sorting a collection of points. The comparison is according to
    // lexicographical ordering. That is, (x, y) < (x', y') if (1) x <
    // x' or (2) x == x' and y < y'.
    this.compareTo = function (p) {
	if (this.x > p.x) {
	    return 1;
	}

	if (this.x < p.x) {
	    return -1;
	}

	if (this.y > p.y) {
	    return 1;
	}

	if (this.y < p.y) {
	    return -1;
	}

	return 0;
    }

    // return a string representation of this Point
    this.toString = function () {
	return "(" + x + ", " + y + ")";
    }
}

// An object that represents a set of Points in the plane. The `sort`
// function sorts the points according to the `Point.compareTo`
// function. The `reverse` function reverses the order of the
// points. The functions getXCoords and getYCoords return arrays
// containing x-coordinates and y-coordinates (respectively) of the
// points in the PointSet.
function PointSet () {
    this.points = [];
    this.curPointID = 0;

    // create a new Point with coordintes (x, y) and add it to this
    // PointSet
    this.addNewPoint = function (x, y) {
	this.points.push(new Point(x, y, this.curPointID));
	this.curPointID++;
    }

    // add an existing point to this PointSet
    this.addPoint = function (pt) {
	this.points.push(pt);
    }

    // sort the points in this.points 
    this.sort = function () {
	this.points.sort((a,b) => {return a.compareTo(b)});
    }

    // reverse the order of the points in this.points
    this.reverse = function () {
	this.points.reverse();
    }

    // return an array of the x-coordinates of points in this.points
    this.getXCoords = function () {
	let coords = [];
	for (let pt of this.points) {
	    coords.push(pt.x);
	}

	return coords;
    }

    // return an array of the y-coordinates of points in this.points
    this.getYCoords = function () {
	let coords = [];
	for (pt of this.points) {
	    coords.push(pt.y);
	}

	return coords;
    }

    // get the number of points 
    this.size = function () {
	return this.points.length;
    }

    // return a string representation of this PointSet
    this.toString = function () {
	let str = '[';
	for (let pt of this.points) {
	    str += pt + ', ';
	}
	str = str.slice(0,-2); 	// remove the trailing ', '
	str += ']';

	return str;
    }
}


function ConvexHullViewer (svg, ps) {
    this.svg = svg;  // an svg object where the visualization is drawn
    this.ps = ps;    // a point set of the points to be visualized
    const rect = svg.getBoundingClientRect();
    // COMPLETE THIS OBJECT
    svg.addEventListener("click", (e) => {
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        ps.addNewPoint(x,y);
        let point=document.createElementNS(SVG_NS,"circle")
        point.classList.add("points")
        point.setAttributeNS(null,"cx",x);
        point.setAttributeNS(null,"cy",y);
        point.setAttributeNS(null,"id","c"+ps.points[ps.points.length-1].id);
        svg.appendChild(point);
       
    })

    this.drawSegment=function(point1,point2){
        let segment=document.createElementNS(SVG_NS,"line")
        segment.classList.add("ch-segment")
        segment.setAttributeNS(null,"x1",point1.x);
        segment.setAttributeNS(null,"y1",point1.y);
        segment.setAttributeNS(null,"x2",point2.x);
        segment.setAttributeNS(null,"y2",point2.y);
        svg.appendChild(segment);
    }

    this.updateSegment=function(point1,point2){
        let segment=document.createElementNS(SVG_NS,"line")
        segment.classList.add("no-ch-segment")
        segment.setAttributeNS(null,"x1",point1.x);
        segment.setAttributeNS(null,"y1",point1.y);
        segment.setAttributeNS(null,"x2",point2.x);
        segment.setAttributeNS(null,"y2",point2.y);
        svg.appendChild(segment);
    }

    this.highlightPoint=function(point){
      let dot=document.querySelector("#c"+point.id);
      dot.classList.add("highlight");
    }

    this.unHighlightPoint = function(point){
        let dot=document.querySelector("#c"+point.id);
        dot.classList.remove("highlight");
      }
}



/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization
    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {

    ps.sort();
    //clear

    // select all elements with class "ch-segment"
const chSeg = document.querySelectorAll(".ch-segment");

// loop through each element and remove it
chSeg.forEach((element) => {
  element.remove();
});

// select all elements with class "no-ch-segment"
const noChSeg = document.querySelectorAll(".no-ch-segment");

// loop through each element and remove it
noChSeg.forEach((element) => {
  element.remove();
});

// select all elements with class "highlight"
const high = document.querySelectorAll(".highlight");

// loop through each element and remove class
high.forEach((element) => {
  element.classList.remove("highlight");
});

    viewer.highlightPoint(ps.points[0]);

    upperSet=[];
    lowerSet=[];
    i = 0;
    update = false;
    check=true;
    }

    let upperSet=[];
    let lowerSet=[];
    let i = 0;
    let update = false;
    let check=true;
    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {
        
        if(check){
    // ps.sort();
    if(i==0){
        upperSet.push(ps.points[0]);
        upperSet.push(ps.points[1]);
        i+=1;
    }
    viewer.unHighlightPoint(upperSet[upperSet.length-2]);
    viewer.highlightPoint(upperSet[upperSet.length-1]);

    if(!update){
        viewer.drawSegment(upperSet[upperSet.length-2],upperSet[upperSet.length-1]);
        if(upperSet[upperSet.length-1]===ps.points[ps.points.length-1]){
            check=false;
        }
        if(i<ps.points.length){
            i++;
            upperSet.push(ps.points[i]); 
        }
    }
    else{
        if(!(lowerSet.includes(upperSet[upperSet.length-2])&&lowerSet.includes(upperSet[upperSet.length-1]))){
             viewer.updateSegment(upperSet[upperSet.length-2],upperSet[upperSet.length-1]);
        }
        if(!(lowerSet.includes(upperSet[upperSet.length-3])&&lowerSet.includes(upperSet[upperSet.length-2]))){
            viewer.updateSegment(upperSet[upperSet.length-3],upperSet[upperSet.length-2]);
        }
        upperSet.splice([upperSet.length-2],1);
        update=false;
    }
    if(upperSet.length>2 && turnsRight(upperSet)){
            update=true;
        }
    }
    else{
        if(lowerSet.length!==0){
                    viewer.unHighlightPoint(lowerSet[0]);
                    return;
        }
        lowerSet=upperSet;
        ps.reverse();
        upperSet=[];
        i = 0;
        update = false;
        check=true;
    }
}
    
	
	
this.curAnimation = null;

    this.animate = function () {
        if (this.curAnimation == null) {
            this.start();
            this.curAnimation = setInterval(() => {
            this.animateStep();
            }, 1000);
        }        
    }
    this.animateStep = function () {
        if (document.querySelector(".highlight") ){
            this.step();
        } else {
            this.stopAnimation();
        }
        }
    
        this.stopAnimation = function () {
        clearInterval(this.curAnimation);
        this.curAnimation = null;
        }

    // Return a new PointSet consisting of the points along the convex
    // hull of ps. This method should **not** perform any
    // visualization. It should **only** return the convex hull of ps
    // represented as a (new) PointSet. Specifically, the elements in
    // the returned PointSet should be the vertices of the convex hull
    // in clockwise order, starting from the left-most point, breaking
    // ties by minimum y-value.
    this.getConvexHull = function () {
        

    let upperSet=[];
    const lowerSet=[];
    ps.sort();


        if(ps.points.length==1){
            return ps;
        }

    upperSet.push(ps.points[0]);
    upperSet.push(ps.points[1]);

    for(let i=2;i<ps.points.length;i++){
        upperSet.push(ps.points[i]);

        while(upperSet.length>2 && !turnsRight(upperSet)){
            upperSet.splice([upperSet.length-2],1);
        }
    }
	ps.reverse();

    lowerSet.push(ps.points[0]);
    lowerSet.push(ps.points[1]);

    for(let i=2;i<ps.points.length;i++){
        lowerSet.push(ps.points[i]);
        while(lowerSet.length>2 && !turnsRight(lowerSet)){
            lowerSet.splice([lowerSet.length-2],1);
        }
    }
    // lowerSet.pop();
    lowerSet.shift();



    // if(!lowerSet.length==0){
       upperSet = upperSet.concat(lowerSet);
    // }


    const pointSet=new PointSet();
    pointSet.points=upperSet;

    return pointSet;
    }

}
    // turnsRight=function(convexSet){
    //     y_actual=convexSet[convexSet.length-1].y;
    //     x_3=convexSet[convexSet.length-1].x;
    //     y_2=convexSet[convexSet.length-2].y;
    //     x_2=convexSet[convexSet.length-2].x;
    //     y_1=convexSet[convexSet.length-3].y;
    //     x_1=convexSet[convexSet.length-3].x;
    //     m=(y_2-y_1)/(x_2-x_1);
    //     y_3=((m*x_3) + (y_1-(m*x_1)))
    //     return y_3<=y_actual;
    // }

    function turnsRight(convexSet) {
        const p3 = convexSet[convexSet.length - 1];
        const p2 = convexSet[convexSet.length - 2];
        const p1 = convexSet[convexSet.length - 3];

        if (!p3)return;
        const crossProduct = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
        return crossProduct < 0;
      }

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!           COMMENT THE FOLLOWING WHEN RUNNING THE TESTER           !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let svg;
let pointSet;
let convexHullViewer;
let convexHull;
function start(){
svg =document.querySelector("#convex-hull-box");
pointSet= new PointSet();
convexHullViewer=new ConvexHullViewer(svg,pointSet);
convexHull= new ConvexHull(pointSet,convexHullViewer);
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!           COMMENT THE FOLLOWING WHEN RUNNING THE TESTER           !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
  } catch (e) {
    console.log("not running in Node");
  }