const container = document.getElementById('container');
const bufferContainer = document.getElementById('buffer-container');

let unitHTMLWidth = null, unitHTMLHeight = null;
let unitSpanWidth = null, unitSpanHeight = null;
let renderWidth = null, renderHeight = null;
function measureHTMLDimensions() {
    let testCharacter = document.createElement('span');
    testCharacter.innerHTML = '&ndash;';
    testCharacter.style.display = 'inline-block';
    testCharacter.style.padding = '0';
    testCharacter.style.margin = '0';
    testCharacter.style.border = 'none';
    document.body.appendChild(testCharacter);
    let rect = testCharacter.getBoundingClientRect();
    unitHTMLWidth = rect.width;
    unitHTMLHeight = rect.height;
    // unitHTMLWidth = testCharacter.offsetWidth; // only return integer dimensions, I need accurate decimal dimensions
    // unitHTMLHeight = testCharacter.offsetHeight;
    testCharacter.remove();

    renderWidth = innerWidth;
    renderHeight = innerHeight;
}

function measureSpanDimensions() {

}

measureHTMLDimensions();

function drawLineWhole(v1, v2) {
    let line = document.createElement('div');
    line.classList.add('rd-line');
    line.innerHTML = '&ndash;';
    let x = (v1.x + v2.x) / 2;
    let y = (v1.y + v2.y) / 2;
    let translate = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    let a = Math.atan2(v2.y - v1.y, v2.x - v1.x);
    let rotate = `rotate(${a}rad)`;
    let s = v2.distance(v1) / unitHTMLWidth;
    let scale = `scale(${s}, 1)`;
    line.style.transform = `${translate} ${rotate} ${scale}`;
    container.append(line);
}

let buffer = null;
function initBuffer() {
    let bw = innerWidth / unitHTMLWidth;
    let bh = innerHeight / unitHTMLHeight;
    buffer = new Buffer(bw, bh, bufferContainer, null);
    // buffer = new Buffer(bw / 1.5, bh / 1.5, bufferContainer, null);

    let ol = (innerWidth - unitHTMLWidth * buffer.width) / 2;
    let ot = (innerHeight - unitHTMLHeight * buffer.height) / 2;
    bufferContainer.style.left = `${ol}px`;
    bufferContainer.style.top = `${ot}px`;

    buffer.setClearArgs();
    buffer.clearAll();
}

let vertexArray = [];
let lineArray = [];
let camera = null, cameraPos = null, cameraMatrix = null;
function setupMesh() {
    vertexArray.push({position: new Vector3(-1, -1, 1), color: Pixel.emptyColor()}); // 0
    vertexArray.push({position: new Vector3(1, -1, 1), color: Pixel.emptyColor()}); // 1
    vertexArray.push({position: new Vector3(1, -1, -1), color: Pixel.emptyColor()}); // 2
    vertexArray.push({position: new Vector3(-1, -1, -1), color: Pixel.emptyColor()}); // 3
    vertexArray.push({position: new Vector3(-1, 1, 1), color: Pixel.emptyColor()}); // 4
    vertexArray.push({position: new Vector3(1, 1, 1), color: Pixel.emptyColor()}); // 5
    vertexArray.push({position: new Vector3(1, 1, -1), color: Pixel.emptyColor()}); // 6
    vertexArray.push({position: new Vector3(-1, 1, -1), color: Pixel.emptyColor()}); // 7

    vertexArray.push({position: new Vector3(0, 0, 0), color: 'red'}); // 8
    vertexArray.push({position: new Vector3(1, 0, 0), color: 'red'}); // 9
    vertexArray.push({position: new Vector3(0, 0, 0), color: 'green'}); // 10
    vertexArray.push({position: new Vector3(0.1, 1, 0), color: 'green'}); // 11 // todo Steve; cheating, otherwise won't display. Need to set a special case in the rasterize function
    vertexArray.push({position: new Vector3(0, 0, 0), color: 'blue'}); // 12
    vertexArray.push({position: new Vector3(0, 0, 1), color: 'blue'}); // 13

    lineArray.push(new Vector2(0, 1)); // 0
    lineArray.push(new Vector2(1, 2)); // 1
    lineArray.push(new Vector2(2, 3)); // 2
    lineArray.push(new Vector2(3, 0)); // 3
    lineArray.push(new Vector2(0, 4)); // 4
    lineArray.push(new Vector2(1, 5)); // 5
    lineArray.push(new Vector2(2, 6)); // 6
    lineArray.push(new Vector2(3, 7)); // 7
    lineArray.push(new Vector2(4, 5)); // 8
    lineArray.push(new Vector2(5, 6)); // 9
    lineArray.push(new Vector2(6, 7)); // 10
    lineArray.push(new Vector2(7, 4)); // 11

    lineArray.push(new Vector2(8, 9)); // 12
    lineArray.push(new Vector2(10, 11)); // 13
    lineArray.push(new Vector2(12, 13)); // 14
}
function setupCamera() {
    camera = new PerspectiveCamera(70, innerWidth / innerHeight);
    cameraPos = new Vector3(3 * Math.sin(time), 2, 3 * Math.cos(time));
    cameraMatrix = new Matrix4().setPosition(cameraPos).lookAt(cameraPos, new Vector3(0, 0, 0), new Vector3(0, 1, 0));
}
function drawMeshLines() {
    // draw line segments
    for (let i = 0; i < lineArray.length; i++) {
        let v1_3 = vertexArray[lineArray[i].x].position;
        let v2_3 = vertexArray[lineArray[i].y].position;

        let v1_4 = worldToNdcSpace(v1_3);
        let v2_4 = worldToNdcSpace(v2_3);

        // not correct, but fun visuals
        // let v1_screen = new Vector2(remap(v1_4.x, -1, 1, 0, innerWidth), remap(v1_4.y, 1, -1, 0, innerHeight));
        // let v2_screen = new Vector2(remap(v2_4.x, -1, 1, 0, innerWidth), remap(v2_4.y, 1, -1, 0, innerHeight));

        // correct
        let v1_screen = ndcToScreenSpace(v1_4);
        let v2_screen = ndcToScreenSpace(v2_4);

        let c1 = vertexArray[lineArray[i].x].color;
        let c2 = vertexArray[lineArray[i].y].color;

        // drawLineWhole(v1_screen, v2_screen);
        drawLineSegments(v1_screen, v2_screen, c1, c2);
    }

    // draw other icon shapes
    for (let i = 0; i < lineArray.length; i++) {
        let v1_3 = vertexArray[lineArray[i].x].position;
        let v2_3 = vertexArray[lineArray[i].y].position;

        let v1_4 = worldToNdcSpace(v1_3);
        let v2_4 = worldToNdcSpace(v2_3);

        let v1_screen = ndcToScreenSpace(v1_4);
        let v2_screen = ndcToScreenSpace(v2_4);

        let c1 = vertexArray[lineArray[i].x].color;
        let c2 = vertexArray[lineArray[i].y].color;

        if (i >= 0 && i <= 7) {
            drawAtCoord(v2_screen, `(${v1_3.x},${v1_3.y},${v1_3.z})`, c1);
        } else if (i === 12 || i === 13 || i === 14) {
            switch(i) {
                case 12:
                    drawAtCoord(v2_screen, 'x', c1);
                    break;
                case 13:
                    drawAtCoord(v2_screen, 'y', c1);
                    break;
                case 14:
                    drawAtCoord(v2_screen, 'z', c1);
                    break;
                default:
                    break;
            }
        } else if (i === 8) { // draw folders
            let v1_buffer = screenToBufferSpace(v1_screen);
            buffer.addShape(v1_buffer.x, v1_buffer.y, dynamicShapes[0], true);
        }
    }
}

let isPaused = false;
function setupEventListeners() {

    let onResizeEndId = null;
    window.addEventListener('resize', () => {
        // todo Steve: add back the lines below for updating camera projection matrix
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();

        if (onResizeEndId !== null) clearTimeout(onResizeEndId);
        onResizeEndId = setTimeout(() => {
            onResizeEnd();
        }, 30);
    })

    function onResizeEnd() {
        let bw = Math.floor(innerWidth / unitHTMLWidth);
        let bh = Math.floor(innerHeight / unitHTMLHeight);
        buffer.resize(bw, bh);
        let ol = (innerWidth - unitHTMLWidth * buffer.width) / 2;
        let ot = (innerHeight - unitHTMLHeight * buffer.height) / 2;
        bufferContainer.style.left = `${ol}px`;
        bufferContainer.style.top = `${ot}px`;
        // buffer.clearAll();
        // buffer.draw();
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            isPaused = !isPaused;
        }
    })
}

let time = 0;
let staticShapes = [];
let dynamicShapes = [];
function init() {
    setupMesh();
    setupCamera();
    setupEventListeners();
    initBuffer();
    addShapes();
    update();
}

init();

function addShapes() {
    let nameStr = '';
    nameStr += '----- ----- |---- |   | |----    |  / \\   /\n';
    nameStr += '|       |   |     |   | |        | /   \\ / \n';
    nameStr += '|-S-|   T   |-E-- \\ V / |-E--    |K     X  \n';
    nameStr += '    |   |   |      \\ /  |        | \\   / \\ \n';
    nameStr += '-----   |   |----   -   |----    |  \\ /   \\';
    let name = new Shape(nameStr);
    staticShapes.push({
        shape: name,
        position: new Vector2(name.center.x, name.center.y),
    });

    let timeObj = new Date();
    let timeStr = `${timeObj.getHours()}:${timeObj.getMinutes()}:${timeObj.getSeconds()}`;
    let time = new Shape(timeStr);
    staticShapes.push({
        shape: time,
        position: new Vector2(buffer.width - time.center.x, time.center.y),
    });

    let number = new Shape(S_NUMBER_ALL_2);
    staticShapes.push({
        shape: number,
        position: new Vector2(number.center.x, 8),
    });

    let folderStr = '';
    folderStr += ' |-|    \n';
    folderStr += ' |----| \n';
    folderStr += ' |////| \n';
    folderStr += ' |----| \n';
    folderStr += 'folder_1';
    let folder = new Shape(folderStr, 'yellow', 'blue');
    dynamicShapes.push(folder);
}

function renderShapes() {
    let newTimeObj = new Date();
    let newTimeStr = `${newTimeObj.getHours()}:${newTimeObj.getMinutes()}:${newTimeObj.getSeconds()}`;
    let timeInfo = staticShapes[1];
    timeInfo.shape.update(newTimeStr);
    timeInfo.position.set(buffer.width - timeInfo.shape.center.x, timeInfo.shape.center.y);

    for (let i = 0; i < staticShapes.length; i++) {
        let shapeInfo = staticShapes[i];
        buffer.addShape(shapeInfo.position.x, shapeInfo.position.y, shapeInfo.shape);
    }
    buffer.draw();
}

function update() {
    setInterval(() => {
        if (isPaused) return;

        time += 0.01;


        buffer.clearAll();

        cameraPos = new Vector3(3 * Math.sin(time), 2, 3 * Math.cos(time));
        cameraMatrix = new Matrix4().setPosition(cameraPos).lookAt(cameraPos, new Vector3(0, 0, 0), new Vector3(0, 1, 0));

        drawMeshLines();

        renderShapes();

        // drawAtCoord(new Vector2(900, 500), '>', 'purple');

    }, 30);
}

// FPS counter
// (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
