import { env, pipeline } from '@huggingface/transformers';
import { eld } from 'eld/large' // use .mjs extension for version <18
import GUI from 'lil-gui'; 
import fs from 'fs';

// console.log(fs.readFile("snitch.txt"));

env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';


let caught_bans = new Array()
const classifier = await pipeline('sentiment-analysis');

const banned_words = ['sigma', 'chingchong','yourmom','yomama','yourmama',
  'yomom','cracker','frog','chinkylee','bokchoylee','adolf','hitler','nazi',
  'swastika','gay','woke', "fart", "queef", "shart", "skidmark", "dingleberry", 
  "turd", "poop", "peepee", "weewee", "weiner", "schlong", "dong",
  "wang", "willy", "hooha", "vajayjay", "coochie", "cooch",
  "punani", "snatch", "muff", "beaver", "box", "beef curtains","epstein","jeffrey",
  "trump","coloniz","black", "choppleganger", "chud", "foid", "femoid", "chopped", 
  "maximillianbobrossian", "smorganboard", "calvin klein", "sixseven", "67", "six7", 
  "6seven", "six-seven","69", "rizzler", "niger", "palestine", "iran", "israel", "jew", 
  "skibidi", "northkorea", "kimjon", "china","russia","ukraine", "isreal", "isreel", "yahu", "precum", "netanyahu"]

// obscenity function

import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from 'obscenity';

const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
})

const params = { threshold: 0.99 }


// lil gui
const gui = new GUI();
gui.add(params, "threshold", 0.9, 1, 0.001);



// profanity check

// let userAnswer = new String;

let globalProfanityBool = new Boolean

const inputElement = document.getElementById("input1")

const banned_string = banned_words.join('\\b|\\b')
    // console.log(banned_string)
    const regex = RegExp(`\\b${banned_string}\\b`)
    console.log(regex)

function checkInput(string) {
  let profanityBool = new Boolean
  if (matcher.hasMatch(string) || regex.test(string.toLowerCase()) || eld.detect(string).language !== "en") {
    // console.log('Profanity detected.');
    profanityBool = true
    globalProfanityBool = true
    caught_bans.push(string)
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
    
    // console.log("Regex:")
    
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
      console.log(eld.detect(value))
      console.log(regex.test(value.toLowerCase()))
      console.log((value.toLowerCase().replace(/\s/g,"")));
      // console.log(banned_words.some(CheckWords()));
      
      // console.log("some check"+banned_words.some(CheckWords(value)));
      
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

      console.log(caught_bans)

    inputElement.value=""
    
})
