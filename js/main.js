let canvas,
    ctx;
const Circle = function () {
    let RADIUS = 200,
        X_CIRCLE_CENTER = 300,
        Y_CIRCLE_CENTER = 300;

    return {
        draw: function (strokeColor, lineWidth, xCircCenter, yCircCenter, radius, arcStart, arcEnd) {
            X_CIRCLE_CENTER = xCircCenter || X_CIRCLE_CENTER;
            Y_CIRCLE_CENTER = yCircCenter || Y_CIRCLE_CENTER;
            Y_CIRCLE_CENTER = 300;
            RADIUS = radius || RADIUS;

            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.arc(X_CIRCLE_CENTER, Y_CIRCLE_CENTER, RADIUS, arcStart, arcEnd);
            ctx.stroke();
        },
        getCoords: function () {
            return { X_CIRCLE_CENTER, Y_CIRCLE_CENTER, RADIUS }
        }
    };
};

const Square = function () {
    return {
        draw: function (strokeColor, lineWidth, startX, startY, endX, endY) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.strokeRect(startX, startY, endX, endY);
        }
    }
};

const Triangle = function () {
    const text1 = new Text(),
          text2 = new Text(),
          text3 = new Text();

    function _getLineLength(x1,y1,x2,y2){
        const dXSquared = Math.pow((x2 - x1), 2);
        const dYSquared = Math.pow((y2 - y1), 2);

        return Math.sqrt(dXSquared + dYSquared);
    }
    return {
        draw: function (angleOfMouseDegrees, x_circle_center, y_circle_center, radius) {
            
            ctx.moveTo(x_circle_center, y_circle_center);
            // Cosine = adjacent  / hypotenuse
            let xEndPoint = x_circle_center + radius * Math.cos(degreesToRadians(angleOfMouseDegrees)); 
            let yEndPoint = y_circle_center + radius * -(Math.sin(degreesToRadians(angleOfMouseDegrees))); 

            ctx.lineTo(xEndPoint, yEndPoint);
            ctx.stroke();
            ctx.moveTo(xEndPoint, yEndPoint);
            ctx.lineTo(xEndPoint, 300);
            ctx.stroke();
            text1.draw(`(${xEndPoint.toFixed(2)}, ${yEndPoint.toFixed(2)}), ${xEndPoint + 10}, ${yEndPoint - 10}`);

            let hypotenuseLength = _getLineLength(x_circle_center, y_circle_center, xEndPoint, yEndPoint);
            text2.draw(`Hypo L : ${hypotenuseLength.toFixed(2)}`, 15, 105);

            let oppositeLength = _getLineLength(xEndPoint, yEndPoint, xEndPoint, 300);
            text3.draw(`Opp L : ${oppositeLength.toFixed(2)}`, 15, 125);
            
        }
    }
};

const Line = function () {
    return {
        draw: function (strokeColor, lineWidth, xStart, yStart, xEnd, yEnd) {
            ctx.moveTo(xStart, yStart);
            ctx.lineTo(xEnd, yEnd);
            ctx.stroke();
        }
    }
}

const Text = function(){
    let text,
        X,
        Y;
    return {
        draw:function(txt, xVal, yVal){
            text = txt || text;
            X = xVal || X;
            Y = yVal || Y;
            ctx.font = "17px Arial";
            ctx.fillText(text, X, Y);
        }
    }
}
const MousePosition = function () {
    let x = 0,
        y = 0;
    return {
        getMousePosition: function () {
            return { x, y };
        },
        setMousePosition: function (newX, newY) {
            x = newX;
            y = newY;
        }
    };
};

let mousePos = new MousePosition(),
    square = new Square(),
    triangle = new Triangle(),
    circle = new Circle(),
    line1 = new Line(),
    line2 = new Line(),
    text1 = new Text(),
    text2 = new Text(),
    text3 = new Text();

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas() {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    drawCanvas();
    canvas.addEventListener('mousemove', redrawCanvas);
}
function drawCanvas() {
    const color = '#839192';
    square.draw(color, 5, 0, 0, 600, 600);
    circle.draw(color, 1, null, null, null, 0, 2 * Math.PI);
    circle.draw(color, 1, null, null, null, 0, 2 * Math.PI);
    line1.draw(color, 1, circle.getCoords().X_CIRCLE_CENTER, 0, circle.getCoords().X_CIRCLE_CENTER, 600 );
    line2.draw(color, 1, 0,circle.getCoords().Y_CIRCLE_CENTER, 600, circle.getCoords().Y_CIRCLE_CENTER);    
    
}
function redrawCanvas(event) { 
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCanvas();
    getMousePosition(event);
    text1.draw("X: " + mousePos.getMousePosition().x, 15, 25);
    text2.draw("Y: " + mousePos.getMousePosition().y, 15, 45);
    let angleOfMouseDegrees = getAngleUsingXAndY(mousePos.getMousePosition().x, mousePos.getMousePosition().y);
    text3.draw("Degrees :" + angleOfMouseDegrees, 15, 65);
    triangle.draw(angleOfMouseDegrees, circle.getCoords().X_CIRCLE_CENTER,circle.getCoords().X_CIRCLE_CENTER,circle.getCoords().RADIUS)
}

function getMousePosition(event){
    let canvasDimensions = canvas.getBoundingClientRect();
    let mouseX = Math.floor(event.clientX - canvasDimensions.left);
    let mouseY = Math.floor(event.clientY - canvasDimensions.top);

    mouseX-= 300;
    mouseY = -1 * (mouseY - 300);
    mousePos.setMousePosition(mouseX, mouseY);
    return mousePos;
}

// function drawTextAtPoint(text, x, y) { }
// X = ADJACENT
// Y = OPPOSITE
function getAngleUsingXAndY(x, y) {
    let adjacent = x,
        opposite = y;
    
    return radiansToDegrees(Math.atan2(opposite, adjacent));
 }
function radiansToDegrees(rad) { 
    if(rad < 0){
        return (360.0 + (rad * (180/ Math.PI))).toFixed(2);
    }else{
         return (rad * (180/ Math.PI)).toFixed(2);
    }
}
function degreesToRadians(degree) {
    return degree * (Math.PI / 180);
}

function getLineLength() { }
