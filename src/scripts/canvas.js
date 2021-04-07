class canvasPlat {
    constructor (props){
        this.coords = [10, 10, 150, 100];
        this.animationDir = 1;
        this.fillColor = `orange`;
        this.can = document.createElement('canvas');
        this.can.height = window.innerHeight;
        this.can.width = window.innerWidth;
        this.ctx = this.can.getContext('2d')
    }

    createCanvas() {
        document.body.append(this.can);
    }

    setColor(color){
        this.fillColor = color;
        document.body.style.backgroundColor = color;
        // document.body.style.filter = `brightness(150%)`;
    }

}
export default canvasPlat;