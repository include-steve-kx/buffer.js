// todo Steve: consider moving part of this to Buffer.js, and other to utils.js / math.js ?

function rasterizeSimple(v1, v2) { // expect integer Vector2 of buffer position (x, y)
    // todo Steve: Bresen
    if (v1.x > v2.x) { // make sure v1 is to the left of v2
        let temp = v1;
        v1 = v2;
        v2 = temp;
    } else if (v1.x === v2.x) { // in case there is NaN number when computing slope (dy / dx)
        v1.x += 0.1;
        v2.x -= 0.1;
    }

    let a = (v2.y - v1.y) / (v2.x - v1.x);
    let b = v1.y - a * v1.x;

    let d = Math.abs(a) <= 1 ? 1 : Math.max(1 / buffer.height, 1 / a);

    let indices = [];
    for (let x = Math.max(v1.x, 0); x <= Math.min(v2.x, buffer.width - 1); x += d) {
        let y = a * x + b;
        if (isNaN(y)) {
            console.warn('Y is NaN', x, y, a, b, v1, v2);
        }
        if (y < 0 || y > buffer.height - 1) continue;
        indices.push(new Vector2(x, y));
    }

    let symbol = '';
    let angle = Math.atan(-a * (unitHTMLHeight / unitHTMLWidth)); // -a b/c it's opposite direction of common sin/cos graph; scale by height / width units b/c more visually correct
    angle = angle * 180 / Math.PI;

    if (angle >= -90 && angle < -60) {
        symbol = '|';
    } else if (angle >= -60 && angle < -30) {
        symbol = '\\';
    } else if (angle >= -30 && angle < 30) {
        symbol = '-';
    } else if (angle >= 30 && angle < 60) {
        symbol = '/';
    } else {
        symbol = '|';
    }

    return {
        indices,
        symbol,
    };
}

function worldToNdcSpace(v) { // expect world space position (x, y, z)
    let v4 = new Vector4(v.x, v.y, v.z, 1); // world space position
    let projectionMatrix = camera.projectionMatrix.clone();
    let viewMatrix = cameraMatrix.clone().invert();
    let projectionViewMatrix = projectionMatrix.multiply(viewMatrix);
    v4.applyMatrix4(projectionViewMatrix); // clip space position
    v4.x /= v4.w; // perspective divide
    v4.y /= v4.w;
    v4.z /= v4.w;
    return v4;
}
function ndcToScreenSpace(v) {
    let sx = v.x * innerWidth / 2 + innerWidth / 2;
    let sy = -v.y * innerHeight / 2 + innerHeight / 2;
    return new Vector2(sx, sy);
}
function screenToBufferSpace(v) {
    let bx = (v.x - innerWidth / 2) * (buffer.width / innerWidth) + buffer.width / 2;
    let by = (v.y - innerHeight / 2) * (buffer.height / innerHeight) + buffer.height / 2;
    return new Vector2(bx, by).floor();
}
function drawLineSegments(v1, v2, c1, c2) { // expect screen space positions (x, y)
    let v1_buffer = screenToBufferSpace(v1);
    let v2_buffer = screenToBufferSpace(v2);

    let result = rasterizeSimple(v1_buffer, v2_buffer);
    for (let i = 0; i < result.indices.length; i++) {
        let v = result.indices[i];
        buffer.set(v.x, v.y, result.symbol, c1); // todo Steve: interpolate the color
    }
    buffer.draw();
}
function drawAtCoord(v, customText, customColor) { // expect screen-space positions (x, y)
    if (customText === undefined) return;
    let s = new Shape(`${customText}`, customColor);
    let v_buffer = screenToBufferSpace(v);
    buffer.addShape(v_buffer.x, v_buffer.y, s);
    buffer.draw();
}