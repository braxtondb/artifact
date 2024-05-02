document.addEventListener("mousedown", drawStart);
document.addEventListener("mousemove", drawMove);
document.addEventListener("mouseup", drawEnd);

let canvas = $('#drawPad')[0];
let ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 480;
ctx.lineWidth = 4;
ctx.strokeStyle = "black";
ctx.fillStyle = "black";
let outputText = $('#textOutput')[0];

const worker = await Tesseract.createWorker("eng", 1, { logger: m => {} });

const recognize = async function(img){
    const ret = await worker.recognize(img);
    outputText.innerHTML = ret.data.text;
}

$('#recognize')[0].addEventListener('click', e => recognize(canvas.toDataURL()));
$('#clear')[0].addEventListener('click', e => ctx.clearRect(0, 0, canvas.width, canvas.height));

var lastPoint = undefined;
var clickPoint = undefined;

function distFrom(x, y) {
    return Math.sqrt(x * x + y * y);
}

function drawStart(e) {
    let canvas = $('#drawPad')[0];
    let rect = canvas.getBoundingClientRect();
    let mX = (e.clientX - rect.x) / rect.width * canvas.width;
    let mY = (e.clientY - rect.y) / rect.height * canvas.height;
    lastPoint = [mX, mY];
    clickPoint = lastPoint;
}

function drawMove(e) {
    if (!e.buttons) return;
    let canvas = $('#drawPad')[0];
    let rect = canvas.getBoundingClientRect();
    let mX = (e.clientX - rect.x) / rect.width * canvas.width;
    let mY = (e.clientY - rect.y) / rect.height * canvas.height;
    if (!lastPoint) lastPoint = [mX, mY];
    ctx.moveTo(lastPoint[0], lastPoint[1]);
    ctx.lineTo(mX, mY);
    ctx.stroke();
    lastPoint = [mX, mY];
}

function drawEnd(e) {
    let canvas = $('#drawPad')[0];
    let rect = canvas.getBoundingClientRect();
    let mX = (e.clientX - rect.x) / rect.width * canvas.width;
    let mY = (e.clientY - rect.y) / rect.height * canvas.height;
    if (clickPoint && distFrom(clickPoint[0] - mX, clickPoint[1] - mY) < 4) {
        // dot
        ctx.beginPath();
        ctx.ellipse(mX, mY, 2, 2, 0, 0, 2*Math.PI);
        ctx.fill();
        ctx.moveTo(mX, mY);
        ctx.stroke();
    }
}