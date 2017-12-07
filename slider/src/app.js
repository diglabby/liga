import style from "./app.css";
import animation from "./animate.css";

const ELEMENTS_LIMIT = 3; // Frames on screen
const STEP = 1; // How much frame change per click
const container = document.querySelector("#slider"); // Node of container with frames

let elementsLimit;

class Slider {
  // Initialization
  constructor(slides) {
    this.setSlidesQuantity();
    const childrens = [...container.children]; // Converting children nodes to array for mapping throught

    // Add on left and right side buttons
    container.appendChild(this.initializeLeftArrow());
    container.appendChild(this.initializeRightArrow());

    // Add needed styles (just layout styles)
    container.className += ` ${style.container}`;

    this.frame = [];
    this.order = [];

    // Making first window - from 0 to window size
    for (let i = 0; i < elementsLimit; i++) {
      this.frame.push(i);
      this.order.push(0); // we need it later, for moving frames from left to right and contrary
    }

    // Initialization of window start position [start pos(s), end pos(e)]
    // [xxx]xxxxx - slides
    // s   e
    this.startFrame = 0;
    this.totalFrames = childrens.length;

    // Add needed styles for all our slides
    childrens.map((slide, index) => slide.classList.add(style.slide));
    this.childrens = childrens;

    // Hiding slides which not in window
    // [xxx]xxxxxx
    //  sss hhhhhh
    // s - shown
    // h - hidden
    this.hideExtraSlides(this.childrens, this.frame);
  }

  onResize() {
    this.setSlidesQuantity();
    this.frame = [];
    this.order = [];

    // Making first window - from 0 to window size
    for (let i = 0; i < elementsLimit; i++) {
      this.frame.push(i);
      this.order.push(0); // we need it later, for moving frames from left to right and contrary
    }

    this.hideExtraSlides(this.childrens, this.frame);
  }

  async setSlidesQuantity() {
    let width = this._getWidth();
    if(width > 768) {
      elementsLimit = 4
    } else if(width <= 768 && width > 534) {
      elementsLimit = 2
    } else {
      elementsLimit = 1
    }
  }

  _getWidth() {
    var width =
      window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    return width;
  }

  hideExtraSlides(slides, frame, direction) {
    slides.map((slide, index) => {
      if (frame.includes(index)) {
        // if slide in range - removing hidden class (even if there isn't hidden class - whatewher?)
        slide.classList.remove(style.hidden);
        slide.classList.remove(...[animation.fadeOut]);

        // adding corresponded order -1, 0, 1 for positioning in right place
        slide.style.order = this.order[index];
      } else {
        // order doesn't metter here, just add hiding class
        slide.classList.add(style.hidden);
        slide.classList.add(...[animation.animated, animation.fadeOut]);
      }
    });
  }

  /*
   * Create right arrow element and wrapper(for extending clickabel zone) with corresponded classes
   */
  initializeRightArrow() {
    const rightArrowWrapper = document.createElement("div");
    const rightArrow = document.createElement("div");

    rightArrowWrapper.className += ` ${style.slider_arrow_wrapper}`;
    rightArrow.className += ` ${style.slider_arrow} ${style.slider_right_arrow}`;
    rightArrowWrapper.style.order = 2;
    rightArrowWrapper.appendChild(rightArrow);
    rightArrowWrapper.addEventListener("click", () =>
      this.animateAllSlides(this.childrens, this.slideRight.bind(this))
    );

    return rightArrowWrapper;
  }

  /*
   * Create left arrow element and wrapper(for extending clickabel zone) with corresponded classes
   */
  initializeLeftArrow() {
    const leftArrowWrapper = document.createElement("div");
    const leftArrow = document.createElement("div");

    leftArrowWrapper.className += ` ${style.slider_arrow_wrapper}`;
    leftArrow.className += ` ${style.slider_arrow} ${style.slider_left_arrow}`;
    leftArrowWrapper.style.order = -2;
    leftArrowWrapper.appendChild(leftArrow);
    leftArrowWrapper.addEventListener("click", () =>
      this.animateAllSlides(this.childrens, this.slideLeft.bind(this))
    );

    return leftArrowWrapper;
  }

  /*
  * A little visual magic here for infinity rotation
  * DOM manipulation are costly, so, I decided, I don't want to change something in DOMe
  */
  calculateFramePosition(i) {
    // So If position of frame in bounds of our frames array, element has flex order equal 0
    if (i >= 0 && i < this.totalFrames) {
      this.frame.push(i);
      this.order[i] = 0;
    } else if (i >= this.totalFrames) {
      // If position of frame more than total then we moving right
      // We want to show frame from left side, and for moving it right
      // We chanign flex order to 1, that more than 0, so it floating right side
      let diff = i - this.totalFrames;

      this.frame.push(diff);
      this.order[diff] = 1;
    } else {
      // If position of frame less than 0 then we moving left
      // We want to show frame from right side here, and for moving it left
      // We chanign flex order to -1, that less than 0 and 1, so it floating left side
      let diff = this.totalFrames + i;

      this.frame.push(diff);
      this.order[diff] = -1;
    }
  }

  animateAllSlides(slides, action, options) {
    action(slides, options);
  }

  /*
   * It's sort of sliding window realisation
   */
  animateSlideRight(slides) {
    return new Promise(resolve =>
      setTimeout(function() {
        slides.map((slide, index) => {
          slide.classList.remove(
            ...[animation.animated, animation.slideOutRight]
          );
          resolve(true);
        });
      }, 600)
    );
  }
  /*
   * Left arrow function, keeping bounds, changing order
   */
  async slideLeft(slides) {
    slides.map((slide, index) =>
      slide.classList.add(...[animation.animated, animation.slideOutRight])
    );

    this.frame = [];
    // We don't wont overflow here, it's not easy reacheble, but still
    // If We complete full round, just reseting to -1
    // (should be -1 because totalFrames position it's 0)
    this.startFrame =
      this.startFrame > -1 * this.totalFrames ? this.startFrame - STEP : -1;

    // Going throught all frames in current window, and moving it left or right if needed
    for (let i = this.startFrame; i < this.startFrame + elementsLimit; i++)
      this.calculateFramePosition(i);

    // All others slides we want to hide
    await this.animateSlideRight(this.childrens);
    this.hideExtraSlides(this.childrens, this.frame, "left");
  }

  animateSlideLeft(slides) {
    return new Promise(resolve =>
      setTimeout(function() {
        slides.map((slide, index) => {
          slide.classList.remove(
            ...[animation.animated, animation.slideOutLeft]
          );
          resolve(true);
        });
      }, 600)
    );
  }

  /*
   * Right arrow function, keeping bounds, changing order
   */
  async slideRight(slides) {
    slides.map((slide, index) =>
      slide.classList.add(...[animation.animated, animation.slideOutLeft])
    );

    this.frame = [];
    // We don't wont overflow here, it's not easy reacheble, but still
    // If We complete full round, just reseting to 1
    // (should be 1 because totalFrames position it's 0)
    this.startFrame =
      this.startFrame < this.totalFrames ? this.startFrame + STEP : 1;

    // Going throught all frames in current window, and moving it left or right if needed
    for (let i = this.startFrame; i < this.startFrame + elementsLimit; i++)
      this.calculateFramePosition(i);

    // All others slides we want to hide
    await this.animateSlideLeft(this.childrens);
    this.hideExtraSlides(this.childrens, this.frame, "right");
  }
}

export default Slider;
