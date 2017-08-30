import style from "./app.css"

let ELEMENTS_LIMIT = 3;
const STEP = 1;
const container = document.querySelector('#slider');

class Slider {
  constructor(slides) {
    ELEMENTS_LIMIT = slides || ELEMENTS_LIMIT;

    const childrens = [...container.children];

    container.appendChild(this.initializeLeftArrow());
    container.appendChild(this.initializeRightArrow());
    container.className += ` ${style.container}`;

    this.frame = [];
    this.order = [];

    for(let i = 0; i < ELEMENTS_LIMIT; i++) {
      this.frame.push(i);
      this.order.push(0);
    }

    this.startFrame = 0;
    this.totalFrames = childrens.length;

    childrens.map((slide, index) => slide.classList.add(style.slide));
    this.childrens = childrens;

    this.hideExtraSlides(this.childrens, this.frame);
  }

  hideExtraSlides(slides, frame) {
    slides.map((slide, index) => {
      if(frame.includes(index)) {
        slide.classList.remove(style.hidden);
        slide.style.order = this.order[index];
      } else {
        slide.classList.add(style.hidden);
      }
    });
  }

  initializeRightArrow() {
    const rightArrowWrapper = document.createElement("div");
    const rightArrow = document.createElement("div");

    rightArrowWrapper.className += ` ${style.slider_arrow_wrapper}`;
    rightArrow.className += ` ${style.slider_arrow} ${style.slider_right_arrow}`;
    rightArrowWrapper.style.order = 2;
    rightArrowWrapper.appendChild(rightArrow);
    rightArrowWrapper.addEventListener("click", this.slideRight.bind(this));

    return rightArrowWrapper;
  }

  initializeLeftArrow() {
    const leftArrowWrapper = document.createElement("div");
    const leftArrow = document.createElement("div");

    leftArrowWrapper.className += ` ${style.slider_arrow_wrapper}`;
    leftArrowWrapper.style.order = -2;
    leftArrow.className += ` ${style.slider_arrow} ${style.slider_left_arrow}`;
    leftArrowWrapper.appendChild(leftArrow);
    leftArrowWrapper.addEventListener("click", this.slideLeft.bind(this));

    return leftArrowWrapper;
  }

  calculateFramePosition(i) {
    if(i >= 0 && i < this.totalFrames) {
      this.frame.push(i)
      this.order[i] = 0;
    } else if (i >= this.totalFrames) {
      let diff = (i - this.totalFrames);

      this.frame.push(diff);
      this.order[diff] = 1;
    } else {
      let diff = (this.totalFrames + i);

      this.frame.push(diff);
      this.order[diff] = -1;
    }
  }

  slideLeft() {
    this.frame = [];
    this.startFrame =
      this.startFrame > -1 * this.totalFrames ? this.startFrame - STEP : -1;

    for(let i = this.startFrame; i < this.startFrame + ELEMENTS_LIMIT; i++)
      this.calculateFramePosition(i);

    this.hideExtraSlides(this.childrens, this.frame);
  }

  slideRight() {
    this.frame = [];
    this.startFrame =
      this.startFrame < this.totalFrames ? this.startFrame + STEP : 1;

    for(let i = this.startFrame; i < this.startFrame + ELEMENTS_LIMIT; i++)
      this.calculateFramePosition(i);

    this.hideExtraSlides(this.childrens, this.frame);
  }

}

export default Slider;
