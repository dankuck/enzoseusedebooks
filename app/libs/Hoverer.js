
export default class Hoverer
{
    constructor() {
        this.message = null;
    }

    hover(component) {
        this.message = {
            component,
            text: component.name || component.hoverName,
            x: component.x,
            y: component.y,
        };
    }

    unhover(component) {
        const message = this.message;
        setTimeout(() => {
            if (this.message && this.message === message && this.message.component === component) {
                this.message = null;
            }
        }, 250);
    }
}
