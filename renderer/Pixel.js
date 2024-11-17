class Pixel {
    constructor(c, color = Pixel.emptyColor(), backgroundColor = Pixel.emptyBackgroundColor()) {
        if (c.length > 1) c = c[0];
        else if (c === ' ' || c.length < 1) {
            c = Pixel.emptyContent();
            color = Pixel.emptyColor();
            backgroundColor = Pixel.emptyBackgroundColor();
        }
        this.c = c; // pixel content
        this.color = color;
        this.backgroundColor = backgroundColor;

        this.clickable = false;
        this.clickCbs = [];

        this.forceDraw = false; // if set to true, later changes to this pixel will be discarded, until buffer.clearAll()
    }

    static emptyPixel() {
        return new Pixel(this.emptyContent(), this.emptyColor(), this.emptyBackgroundColor());
    }

    static setEmptyContent(c) {
        if (c.length > 1) window.PIXEL_EMPTY_CONTENT = c[0];
        else if (c.length < 1) {
            window.PIXEL_EMPTY_CONTENT = ' ';
        }
        return window.PIXEL_EMPTY_CONTENT;
    }

    static emptyContent() {
        return Pixel.setEmptyContent(window.PIXEL_EMPTY_CONTENT);
    }

    static emptyColor() {
        return window.PIXEL_EMPTY_COLOR;
    }

    static emptyBackgroundColor() {
        return window.PIXEL_EMPTY_BACKGROUND_COLOR;
    }

    set(c, color = Pixel.emptyColor(), backgroundColor = Pixel.emptyBackgroundColor()) {
        if (c.length > 1) c = c[0];
        this.c = c;
        this.color = color;
        this.backgroundColor = backgroundColor;
    }

    reset(c, color = Pixel.emptyColor(), backgroundColor = Pixel.emptyBackgroundColor()) {
        this.set(c, color, backgroundColor);
        if (this.forceDraw) this.setForceDraw(false);
    }

    get() {
        return {
            c: this.c,
            color: this.color,
            backgroundColor: this.backgroundColor,
        };
    }

    getContent() {
        return this.c;
    }

    getColor() {
        return this.color;
    }

    getBackgroundColor() {
        return this.backgroundColor;
    }

    setColor(color) {
        this.color = color;
    }

    setBackgroundColor(backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    setForceDraw(flag) {
        this.forceDraw = flag;
    }
}
