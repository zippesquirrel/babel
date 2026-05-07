import { update } from "three/examples/jsm/libs/tween.module.js";

const input = document.getElementById('input1');
const widthTester = document.getElementById('widthTester');

const inputStyle = window.getComputedStyle(input);
const paddingLeft = parseFloat(inputStyle.paddingLeft);
const paddingRight = parseFloat(inputStyle.paddingRight);

function updateInputWidth() {

    const text = input.value.trim() || input.placeholder;


    widthTester.textContent = text;

    const contentWidth  = widthTester.offsetWidth;
    const totalWidth = contentWidth + paddingLeft + paddingRight

    input.style.width = `${1.7*totalWidth+4}px`
}

input.addEventListener('input', updateInputWidth);