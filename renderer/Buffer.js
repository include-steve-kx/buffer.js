class Buffer {
    constructor(width, height, htmlContainer = null, canvasContainer = null) {
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        this.b = null; // buffer content, a 2d array of Pixel's, [height, width]; height: top --> bottom, width: left --> right

        // draw options
        this.isDrawToHTML = true;
        this.htmlContainer = htmlContainer;

        this.isDrawToCanvas = false;
        this.canvasContainer = canvasContainer;
        this.ctx = null;

        this.isDrawToConsole = false;

        this.isDrawStyle = true;
        this.styles = [];
        this.leftBorder = '@@@|';
        this.rightBorder = '|@@@';

        // clear args
        this.clearContent = Pixel.emptyContent();
        this.clearColor = Pixel.emptyColor();
        this.clearBackgroundColor = Pixel.emptyBackgroundColor();

        this.allStr = [];

        // todo Steve: add a depth buffer here
        //  update rasterize algorithm
        //  find bottleneck,
        //  still very slow after optimizing
        //      try random rendering all pixels to different color & see the performance
        //      might need to consider only rendering the visible pixels to the screen, using css transform property

        this.setup();
    }

    setup() {
        this.b = new Array(this.height);
        for (let i = 0; i < this.height; i++) {
            this.b[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
                // build buffer
                this.b[i][j] = Pixel.emptyPixel();
            }
        }


        // todo Steve: add support to setup & draw on canvas element
        if (this.isDrawToCanvas) {
            this.ctx = this.canvasContainer.getContext('2d');
        }


        this.clearAll();


        // clearConsole();
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.b.length = 0;

        this.setup();
    }

    setClearArgs(c = Pixel.emptyContent(), color = Pixel.emptyColor(), backgroundColor = Pixel.emptyBackgroundColor()) {
        this.clearContent = c;
        this.clearColor = color;
        this.clearBackgroundColor = backgroundColor;
    }

    getChildNodeIndex(x, y) {
        return y * (this.width + 1) + x;
    }

    // todo Steve: NOTE that in efficient mode, if we need to reset to the empty style of everything, we need to do clearAll(true), aka set the force flag to true !!!!!!!!!
    clearAll() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let pixel = this.b[i][j];
                pixel.reset(this.clearContent, this.clearColor, this.clearBackgroundColor);
            }
        }

        if (this.isDrawToHTML) {
            this.htmlContainer.style.background = 'black';
            this.htmlContainer.innerHTML = '';
        } else if (this.isDrawToCanvas) {

        }

        if (this.isDrawToConsole) {
            // clearConsole();
        }
    }

    get(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (this.isOutOfBound(x, y)) {
            // console.error('Draw buffer get content out of bound.');
            return;
        }
        return this.b[y][x].get();
    }

    set(x, y, c, color = Pixel.emptyColor(), backgroundColor = Pixel.emptyBackgroundColor(), forceDraw = false) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (this.isOutOfBound(x, y)) {
            // console.error('Draw buffer set content out of bound.');
            return;
        }
        try {
            let pixel = this.b[y][x];
            if (pixel.forceDraw) return;
            pixel.set(c, color, backgroundColor);
            if (forceDraw) pixel.setForceDraw(true);
        } catch (e) {
            console.error(`Cannot draw in buffer (${x},${y})`, e);
        }
    }

    setFromShapePixel(x, y, pixelFromShape, forceDraw = false) {
        // for (let i = 0; i < shape.width; i++) {
        //     for (let j = 0; j < shape.height; j++) {
        //         let p = shape.localToWorld(i, j, x, y);
        //         let pixelInfo = shape.get(i, j);
        //         this.set(p.x, p.y, pixelInfo.c, pixelInfo.color, pixelInfo.backgroundColor, forceDraw);
        //     }
        // }
        // todo Steve:
        x = Math.floor(x);
        y = Math.floor(y);
        if (this.isOutOfBound(x, y)) {
            // console.error('Draw buffer set content out of bound.');
            return;
        }
        try {
            let pixel = this.b[y][x];
            if (pixel.forceDraw) return;
            pixel = pixelFromShape;
            if (forceDraw) pixel.setForceDraw(true);
        } catch (e) {
            console.error(`Cannot draw in buffer (${x},${y})`, e);
        }
    }

    addShape(x, y, shape, forceDraw = false) {
        let c = 0;
        for (let i = 0; i < shape.width; i++) {
            for (let j = 0; j < shape.height; j++) {
                let p = shape.localToWorld(i, j, x, y);
                let pixelInfo = shape.get(i, j);
                this.set(p.x, p.y, pixelInfo.c, pixelInfo.color, pixelInfo.backgroundColor, forceDraw);
                // let pixel = shape.c[j][i];
                // this.setFromShapePixel(p.x, p.y, pixel, forceDraw);
            }
        }
        let d = 0;
    }

    clearStyles() {
        this.styles.length = 0;
    }

    enableStyle() {
        this.isDrawStyle = true;
    }

    disableStyle() {
        this.isDrawStyle = false;
    }

    postprocess(s) {
        let fs = '';
        for (let c of s) {
            fs += `%c${c}`;
        }
        return fs;
    }

    // todo Steve:
    //  allStr --> this.strings
    //

    draw() { // new drawing code to output console in one single string, looks better

        // main game window

        this.drawToHTMLFast();
        return;

        // clear draw string and style
        // let allStr = '';
        let allStr = [];
        this.clearStyles();

        for (let i = 0; i < this.height; i++) {
            // let str = '';
            // let str = [];
            for (let j = 0; j < this.width; j++) {
                // str += this.b[i][j].getContent();

                // str.push(this.b[i][j].getContent());
                allStr.push(this.b[i][j].getContent());
                let color = this.b[i][j].getColor();
                let backgroundColor = this.b[i][j].getBackgroundColor();
                this.styles.push(`color:${color}; background:${backgroundColor}`);
            }
            // str += '\n';

            // str.push('\n');
            allStr.push('\n');
            this.styles.push(''); // style placeholder for the new line character
            // allStr += `${str}`;

            // allStr.push(...str);
        }

        if (this.isDrawToHTML) {
            this.drawToHTML(allStr);
        }

        if (this.isDrawToConsole) {
            // this.drawToConsole(allStr);
        }
    }

    drawToHTMLFast() {
        // optimize performance:
        // 1. don't use string, use array. populating everything into an array and then use String.join() function yields better performance
        // 2. use this.allStr instead of let allStr (not sure if this is useful)
        this.allStr.length = 0;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let content = this.b[i][j].getContent();
                let color = this.b[i][j].getColor();
                let backgroundColor = this.b[i][j].getBackgroundColor();
                if (content === ' ') {
                    this.allStr.push('&nbsp;');
                } else {
                    if (this.isDrawStyle) {
                        this.allStr.push(`<span style='color:${color}; background:${backgroundColor}'>${content}</span>`);
                    } else {
                        this.allStr.push(`${content}`);
                    }
                }
            }
            this.allStr.push('<br>');
        }
        this.htmlContainer.innerHTML = this.allStr.join('');
    }

    drawToHTML(s) {
        // let fs = '';
        let fs = [];
        for (let i = 0; i < s.length; i++) {
            let c = s[i];
            if (c === '\n') {
                // fs += '<br>';
                fs.push('<br>');
            } else if (c === ' ') {
                // fs += '&nbsp;';

                // fs += `<span style='${this.styles[i]}'>&nbsp;</span>`;

                fs.push('&nbsp;')
            } else {
                if (this.isDrawStyle) {
                    // fs += `<span style='${this.styles[i]}'>${c}</span>`;
                    fs.push(`<span style='${this.styles[i]}'>${c}</span>`);
                } else {
                    // fs += `<span>${c}</span>`;
                    fs.push(`<!--<span>${c}</span>-->`);
                }
            }
        }
        // this.htmlContainer.innerHTML = fs;

        // console.log(fs.length);

        this.htmlContainer.innerHTML = fs.join('');
    }

    drawToConsole(str) {
        let consoleStr = this.postprocess(str);
        if (this.isDrawStyle) {
            console.log(`${consoleStr}`, ...this.styles);
        } else {
            console.log(str);
        }
        // console.log(str.length, this.styles.length);
    }

    customfix(customStr, isSingleColor = true, midStyle = Pixel.emptyColor(), leftStyle = Pixel.emptyColor(), rightStyle = Pixel.emptyColor()) {
        if (!isSingleColor && customStr.length !== midStyle.length) {
            console.error('customfix() error: provided custom string and midStyle dimension mismatch.');
            return;
        }

        let lhLength = Math.floor((this.width - customStr.length) / 2) + 1;
        let rhLength = this.width - customStr.length - lhLength;

        let str = this.leftBorder;
        for (let i = 0; i < lhLength; i++) str += '-';
        str += customStr;
        for (let i = 0; i < rhLength; i++) str += '-';
        str += this.rightBorder;
        str += '\n';

        for (let i = 0; i < str.length; i++) {
            if (isSingleColor) {
                this.styles.push(`color:${midStyle}; font-family: "Courier New", Courier, monospace; line-height: 1;`);
            } else {
                if (i < this.leftBorder.length + lhLength) this.styles.push(`${leftStyle}`);
                else if (i >= this.leftBorder.length + lhLength + customStr.length) this.styles.push(`${rightStyle}`);
                else this.styles.push(`${midStyle[i - (this.leftBorder.length + lhLength)]}`);
            }
        }

        return str;
    }

    isOutOfBound(x, y) {
        return this.width <= x || this.height <= y || x < 0 || y < 0;
    }

    isOnBound(x, y) {
        // y === -1, b/c if this is y === 0, when an enemy is first spawned, it is on bound
        // this.width - 1 === x || this.width - 2 === x --> b/c if enemy move too fast, it might overshoot and go past the boundary. So need extended boundary to double check
        return this.width - 1 === x || this.width - 2 === x || this.height === y || x === 0 || y === -1;
        // let b1 = this.width - 1 === x
        // let b5 = this.width - 2 === x
        // let b2 = this.height === y
        // let b3 = x === 0
        // let b4 = y === -1
        // let flag = b1 || b2 || b3 || b4 || b5;
        // return flag;
    }
}