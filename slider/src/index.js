import App from "./app.js";

let slider = new App(4);

window.addEventListener("resize", () => slider.onResize.bind(slider)())
