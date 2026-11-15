export default class Timer {
    constructor() {
        /** @type {HTMLDivElement} */ // @ts-ignore
        this.timer = document.querySelector("#time-spent");
        this.interval = null;
        this.time = 0;
    }

    start() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        } else {
            this.interval = setInterval(() => { this.tick() }, 1000);
        }
    }

    tick() {
        this.time++;
        let seconds = this.time % 60;
        let minutes = ~~(this.time / 60) % 60;
        let hours = ~~(seconds / 60);

        let a = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        this.timer.innerText = a;
        this.timer.setAttribute("data-shadow", a);
    }
}
