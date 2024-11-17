class Shape {
    constructor(str, color = Pixel.emptyColor(), backgroundColor = Pixel.emptyBackgroundColor()) {
        this.c = null; // shape content, a 2d array of Pixel's, [height, width]; height: top --> bottom, width: left --> right
        this.width = null;
        this.height = null;
        this.center = new Vector2();
        this.color = color;
        this.backgroundColor = backgroundColor;

        this.parseShape(str, color, backgroundColor);
        this.computeCenter();
    }

    parseShape(str, col, bgCol) {
        let arr = str.split('\n');
        this.width = arr[0].length;
        this.height = arr.length;

        this.c = new Array(this.height);
        for (let i = 0; i < this.height; i++) {
            this.c[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
                this.c[i][j] = new Pixel(arr[i][j], col, bgCol);
            }
        }
    }

    update(str, color = this.color, backgroundColor = this.backgroundColor) {
        this.parseShape(str, color, backgroundColor);
        this.computeCenter();
    }

    printShape() {
        for (let i = 0; i < this.height; i++) {
            let str = '';
            for (let j = 0; j < this.width; j++) {
                str += this.c[i][j].getContent();
            }
            console.log(str);
        }
    }

    computeCenter() {
        this.center.x = Math.floor(this.width / 2);
        this.center.y = Math.floor(this.height / 2);
    }

    get(x, y) {
        if (x >= this.width || y >= this.height) { // just a safety net, is technically not supposed to trigger. If ever triggered, need to check why it's accessing out-of-bound values
            return {
                c: '?',
                color: Pixel.emptyColor(),
                backgroundColor: Pixel.emptyBackgroundColor(),
            };
        }
        return this.c[y][x].get();
    }

    getContent(x, y) {
        if (x >= this.width || y >= this.height) {
            return '?';
        }
        return this.c[y][x].getContent();
    }

    getColor(x, y) {
        if (x >= this.width || y >= this.height) {
            return Pixel.emptyColor();
        }
        return this.c[y][x].getColor();
    }

    setColor(color) {
        this.color = color;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.c[i][j].setColor(color);
            }
        }
    }

    localToWorld(i, j, x, y) {
        // when the shape center is at (x, y) in world space, what's the world space coords of (i, j) in local space
        let px = i + x - this.center.x;
        let py = j + y - this.center.y;
        return new Vector2(px, py);
    }

    worldToLocal(x, y, px, py) {
        // when the shape center is at (x, y) in world space, what's the local space coords of (px, py) in world space
        let i = px - x + this.center.x;
        let j = py - y + this.center.y;
        return new Vector2(i, j);
    }

    setClick(cb) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.c[i][j].clickable = true;
                this.c[i][j].clickCbs.push(cb);
            }
        }
    }

    clearClick() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.c[i][j].clickable = false;
                this.c[i][j].clickCbs = [];
            }
        }
    }
}