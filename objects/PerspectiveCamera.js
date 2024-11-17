class PerspectiveCamera {
    constructor( fov = 50, aspect = 1, near = 0.1, far = 2000 ) {

        this.isCamera = true;

        this.matrixWorldInverse = new Matrix4();

        this.projectionMatrix = new Matrix4();
        this.projectionMatrixInverse = new Matrix4();

        this.isPerspectiveCamera = true;

        this.type = 'PerspectiveCamera';

        this.fov = fov;
        this.zoom = 1;

        this.near = near;
        this.far = far;
        this.focus = 10;

        this.aspect = aspect;

        this.updateProjectionMatrix();

    }

    updateProjectionMatrix() {

        const near = this.near;
        let top = near * Math.tan( Math.PI / 180 * 0.5 * this.fov ) / this.zoom;
        let height = 2 * top;
        let width = this.aspect * height;
        let left = - 0.5 * width;

        this.projectionMatrix.makePerspective( left, left + width, top, top - height, near, this.far );

        this.projectionMatrixInverse.copy( this.projectionMatrix ).invert();

    }
}