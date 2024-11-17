class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    addVectors(v1, v2) {
        return v1.clone().add(v2);
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    sub(v) {
        return this.add(v.clone().negate());
    }

    subVectors(v1, v2) {
        return v1.clone().sub(v2);
    }

    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    divideScalar(s) {
        this.x /= s;
        this.y /= s;
        return this;
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    length() {
        return Math.sqrt(this.lengthSq());
    }

    distance(v) {
        return new Vector2().subVectors(this, v).length();
    }

    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

    normalize() {
        let l = this.length();
        if (l === 0) return this;
        this.divideScalar(l);
        return this;
    }

    zeros() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    ones() {
        this.x = 1;
        this.y = 1;
        return this;
    }
}