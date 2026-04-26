import { env, pipeline } from '@huggingface/transformers';
import GUI from 'lil-gui'; 

env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';

const classifier = await pipeline('sentiment-analysis');

// obscenity function

import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from 'obscenity';

const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
})

const params = { threshold: 0.5 }


// lil gui
const gui = new GUI();
gui.add(params, "threshold", 0, 1, 0.01);



// profanity check

// let userAnswer = new String;

let globalProfanityBool = new Boolean

const inputElement = document.getElementById("input1")

function checkInput(string) {
  let profanityBool = new Boolean
  if (matcher.hasMatch(string)) {
    console.log('Profanity detected.');
    profanityBool = true
    globalProfanityBool = true
    // event.target.style.backgroundColor = "#ff0000";
    } 
    // no profanity
    else {
    profanityBool = false
    globalProfanityBool = false
    // event.target.style.backgroundColor = "green";
    }
    document.getElementById("profanity").innerText = profanityBool
}

function displayAllowed(bool, id) {
  if (bool){
    return '<p>allowed</p>'
  } else {
    return '<p>not allowed</p>'
  }
}


inputElement.addEventListener("keydown", 
  async function (event) {
    let allowed = new Boolean
    // old text for live listener/update
    // const value = event.target.value;
    // document.getElementById("output").innerText = value;
    // userAnswer = value;

    // return is used to exit the function (don't bother if the key isn't enter)
    if (event.key !== 'Enter') return;

    // prevents browser from fucking with form
    event.preventDefault();

    // remove whitespaces
    const value = inputElement.value.trim();
    // return if empty
    if (!value) return;
      // actual gizmo
      console.log(value);

      checkInput(value);
      const result = await classifier(value);

      let sentiment = result[0];
      console.log(sentiment)
      document.getElementById("sentiment").innerText=`label: ${sentiment.label} confidence: ${sentiment.score.toFixed(4)}`
      
      if (((sentiment.score > params.threshold) && !globalProfanityBool)&& sentiment.label === "POSITIVE") {
        allowed = true
      } else {
        allowed = false
      }

      // == debug logging ==
      // console.log("allowed: " + allowed)
      // console.log("no swear: " + !globalProfanityBool)
      // console.log("threshold: " + params.threshold)
      // console.log("high nuff: " + (sentiment.score > params.threshold))
      // console.log("id: " + event.target.id)
      document.getElementById("verdict").innerHTML=displayAllowed(allowed, event.target.id)

    inputElement.value=""
    
})


// sentiment

// console.log("start")

