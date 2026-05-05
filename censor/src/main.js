import { env, pipeline } from '@huggingface/transformers';
import { eld } from 'eld/large' // use .mjs extension for version <18
import GUI from 'lil-gui'; 
import fs from 'fs';

env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';
const classifier = await pipeline('sentiment-analysis');

let caught_bans = new Array()
let positive_array = new Array()

const wide_chars = ['m','M','w','W']
const narrow_chars = ['I','i','l']

// lil gui
const params = { threshold: 0.99 }
const gui = new GUI();
gui.add(params, "threshold", 0.9, 1, 0.001);

const blacklist = 
['sigma', 'chingchong','yourmom','yomama','yourmama',
  'yomom','cracker','frog','chinkylee','bokchoylee','adolf','hitler','nazi',
  'swastika','gay','woke', "fart", "queef", "shart", "skidmark", "dingleberry", 
  "turd", "poop", "peepee", "weeweze", "weiner", "schlong", "dong",
  "wang", "willy","epstein","jeffrey",
  "trump","coloniz","black", "choppleganger", "chud", "foid", "femoid", "chopped", 
  "maximillianbobrossian", "smorganboard", "calvin klein", "sixseven", "67", "six7", 
  "6seven", "six-seven","69", "rizzler", "niger", "palestine", "iran", "israel", "jew", 
  "skibidi", "northkorea", "kimjon", "china","russia","ukraine", "isreal", "isreel", "yahu", "precum", "netanyahu"]

const whitelist = ['cookie','love']
// obscenity function

import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from 'obscenity';

const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
})


// profanity check

let globalProfanityBool = new Boolean

const inputElement = document.getElementById("input1")

function toRegex(arr,separator){
  const arrayString = arr.join(`${separator}|${separator}`)
  const arrayRegex = RegExp(`\\b${arrayString}\\b`)
  return arrayRegex
}
// const blacklistString = blacklist.join('\\b|\\b')
//     // console.log(banned_string)
// const blacklistRegex = RegExp(`\\b${blacklistString}\\b`)
const blacklistRegex = toRegex(blacklist,'\\b');
const whitelistRegex = toRegex(whitelist, '\\b')
console.log(blacklistRegex);
console.log(whitelistRegex)

function checkInput(string) {
  let profanityBool = new Boolean

  if (matcher.hasMatch(string) || blacklistRegex.test(string.toLowerCase()) || (eld.detect(string).language !== "en" && !whitelistRegex.test(string.toLowerCase()) )) {

    profanityBool = true
    globalProfanityBool = true
    caught_bans.push(string)
  } 
    // no profanity
  else {
    profanityBool = false
    globalProfanityBool = false
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

const container = document.getElementById("dynamic-container");


function SpiralAppend(char, index){
  const newParagraph = document.createElement("span");
  newParagraph.textContent = char;
  newParagraph.style.setProperty("--i",index);

  container.appendChild(newParagraph)
};

function CharWidth(char, epsilon){
  if (wide_chars.includes(char)){
    
    return (1+epsilon)
    
  } else if (narrow_chars.includes(char)){
    return (1-epsilon)
  } else {
    
    return 1
    
  };
};



let index = 14

inputElement.addEventListener("keydown", 
  async function (event) {
    
    // console.log("Regex:")
    
    let allowed = new Boolean

    // return is used to exit the function (don't bother if the key isn't enter)
    if (event.key !== 'Enter') return;

    // prevents browser from fucking with form
    event.preventDefault();

    const valueNoTrim = inputElement.value
    // remove whitespaces
    const value = inputElement.value.trim();

    // return if empty
    if (!value) return;
    console.log(value+ "detected as: " + eld.detect(value).language);
    console.log((whitelistRegex.test(value.toLowerCase)))
    console.log(((eld.detect(value).language !== "en") && (whitelistRegex.test(value.toLowerCase)===false )));
    console.log(blacklistRegex.test(value.toLowerCase()));
    console.log((value.toLowerCase().replace(/\s/g,"")));
     
    // actual gizmo
    console.log(value);

    checkInput(value);
    const result = await classifier(value);

    let sentiment = result[0];
    console.log(sentiment)
    document.getElementById("sentiment").innerText=`label: ${sentiment.label} confidence: ${sentiment.score.toFixed(4)}`
      
    if (((sentiment.score > params.threshold) && !globalProfanityBool)&& sentiment.label === "POSITIVE") {
      allowed = true
      let valueLen = 0;
      for (let i = 0; i < valueNoTrim.length; i++){
        let char = valueNoTrim.charAt(i);
        // broken rn </3 CharWidth(char,0.1)
        SpiralAppend(char,i+index);
        valueLen ++;
      };
      index += valueLen + 1;
      document.documentElement.style.setProperty('--offset',index-300);
      console.log(index);

    } else {
      allowed = false;
    };

      // == debug logging ==
      // console.log("allowed: " + allowed)
      // console.log("no swear: " + !globalProfanityBool)
      // console.log("threshold: " + params.threshold)
      // console.log("high nuff: " + (sentiment.score > params.threshold))
      // console.log("id: " + event.target.id)
    document.getElementById("verdict").innerHTML=displayAllowed(allowed, event.target.id);

    console.log(caught_bans);

    inputElement.value="";
    
})
