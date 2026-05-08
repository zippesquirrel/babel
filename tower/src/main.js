import { env, pipeline } from '@huggingface/transformers';
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from 'obscenity';
import { eld } from 'eld/large';
import GUI from 'lil-gui'; 
import fs from 'fs';
console.log("starting...")
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';
const classifier = await pipeline('sentiment-analysis');
console.log("ready!")
// document.getElementById("input1").style.setProperty("visibility","visible")
let caught_bans = new Array();
let positive_array = new Array();



const wide_chars = ['m','M','w','W'];
const narrow_chars = ['I','i','l'];

// lil gui
const params = { threshold: 0.9 };
// const gui = new GUI();
// gui.add(params, "threshold", 0.5, 1, 0.001);

const blacklist = 
['sigma', 'ching chong','your mom','yo mama','your mama',
  'yo mom','cracker','frog','chinky lee','bokchoy lee','adolf','hitler','nazi',
  'swastika','gay','woke', "fart", "queef", "shart", "skidmark", "dingleberry", 
  "turd", "poop", "peepee", "weeweze", "weiner", "schlong", "dong",
  "wang", "willy","epstein","jeffrey",
  "trump","coloniz","black", "choppleganger", "chud", "foid", "femoid", "chopped", 
  "maximillian bob rossian", "smorganboard", "calvin klein", "sixseven", "67", "six7", 
  "6seven", "six-seven","69", "rizzler", "niger", //the country
  "palestine", "iran", "israel", "jew", 
  "skibidi", "northkorea", "kimjon", "china","russia","ukraine", "isreal", "isreel", "yahu", "precum", "kill", 
  "netanyahu", "xi","jinping","mao","zhedong","zedong","down bad","kirk","charlie","tate","lowkirkenuinely","flowkirkenuinely","flowkenuinely","lowkenuinely","triple t",'tung',"Tralalero"]

const whitelist = ["cookies","love","doctor","kindness","sunshine",
  "laughter","friendship","music","art","dance","joy","peace","hope",
  "family","home","garden","nature","ocean","stars","moon","sunrise",
  "sunset","rainbow","butterfly","flowers","puppy","kitten","birds",
  "trees","mountains","rivers","freedom","creativity","wisdom","learning",
  "growth","health","healing","strength","courage","compassion","gratitude",
  "generosity","adventure","discovery","innovation","science","books",
  "poetry","stories","dreams","celebration","birthday","wedding","baby",
  "hug","smile","gift","food","pizza","chocolate","ice cream","coffee",
  "tea","bread","fruit","vegetables","soup","music","singing","dancing",
  "painting","drawing","photography","travel","hiking","swimming","yoga",
  "meditation","exercise","sleep","rest","vacation","holiday","beach","forest",
  "park","playground","school","university","graduation","career","success",
  "achievement","award","community","volunteer","charity","support","help",
  "rescue","safety","protection","medicine","therapy","wellness","fitness",
  "nutrition","friendship","teamwork","collaboration","unity","diversity",
  "inclusion","equity","justice","truth","beauty","wonder","curiosity",
  "imagination","inspiration","motivation","confidence","patience","resilience",
  "perseverance","humor","fun","games","sports","soccer","basketball","baseball",
  "tennis","swimming","cycling","running","climbing","sailing","surfing","reading",
  "writing","coding","engineering","architecture","fashion","design","theater","film",
  "television","radio","podcast","comedy","adventure","fantasy","romance","mystery",
  "history","culture","tradition","heritage","ceremony","ritual","feast","harvest",
  "spring","summer","autumn","winter","rain","snow","clouds","breeze","warmth",
  "light","color","texture","melody","harmony","rhythm","balance","clarity",
  "simplicity","elegance","grace","dignity","integrity","honesty","loyalty",
  "trust","respect","empathy","listening","understanding","forgiveness",
  "reconciliation","renewal","transformation","progress","sustainability",
  "environment","conservation","wildlife","biodiversity","ecosystem","planet",
  "universe","exploration","discovery","curiosity","wonder","awe","gratitude",
  "abundance","prosperity","opportunity","potential","possibility","future",
  "legacy","memory","nostalgia","comfort","safety","belonging","acceptance",
  "validation","encouragement","praise","recognition","reward","celebration",
  "milestone","journey","path","destination","purpose","meaning","fulfillment",
  "happiness","contentment","serenity","bliss","euphoria","excitement","enthusiasm",
  "passion","dedication","commitment","discipline","focus","clarity","vision","mission",
  "values","principles","ethics","morality","virtue","character","leadership",
  "mentorship","guidance","education","knowledge","expertise","skill","talent",
  "gift","blessing","miracle","magic","wonder","mystery","discovery","surprise",
  "delight","pleasure","satisfaction","accomplishment","pride","dignity","honor",
  "respect","admiration","inspiration","aspiration","ambition","determination",
  "grit","tenacity","endurance","stamina","vitality","energy","power","strength",
  "confidence","optimism","positivity","faith","belief","trust","love", "gamer", "youtuber", "volleyball"];
// obscenity function

const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
});


// profanity check

let globalProfanityBool = new Boolean;

const inputElement = document.getElementById("input1");

function toRegex(arr,separator){
  const arrayString = arr.join(`${separator}|${separator}`);
  const arrayRegex = RegExp(`\\b${arrayString}\\b`);
  return arrayRegex;
};
// const blacklistString = blacklist.join('\\b|\\b')
//     // console.log(banned_string)
// const blacklistRegex = RegExp(`\\b${blacklistString}\\b`)
const blacklistRegex = toRegex(blacklist,'\\b');
const whitelistRegex = toRegex(whitelist, '\\b');

//regex logging
// console.log(blacklistRegex);
// console.log(whitelistRegex);


function checkInput(string) {
  let profanityBool = new Boolean

  if (matcher.hasMatch(string) || blacklistRegex.test(string.toLowerCase()) || (eld.detect(string).language !== "en" && !whitelistRegex.test(string.toLowerCase()) )) {
    
    profanityBool = true;
    globalProfanityBool = true;
    caught_bans.push(string);
  } 
    // no profanity
  else {
    profanityBool = false;
    globalProfanityBool = false;
  };
  // document.getElementById("profanity").innerText = profanityBool;
}

function displayAllowed(bool, id) {
  if (bool){
    return '<p>allowed</p>';
  } else {
    return '<p>not allowed</p>';
  }
}

const container = document.getElementById("dynamic-container");


// apends character to spiral at index with opacity brightness

function SpiralAppend(char, index, id){
  const newParagraph = document.createElement("span");
  newParagraph.textContent = char;
  newParagraph.style.setProperty("--i",index);
  newParagraph.className = id
  // newParagraph.style.setProperty("--brightness",bright);

  container.appendChild(newParagraph);
};

window.snitch = function Snitch(){
  return(caught_bans);
};

//broken, WIP

function CharWidth(char, epsilon){
  if (wide_chars.includes(char)){
    
    return (1+epsilon);
    
  } else if (narrow_chars.includes(char)){
    return (1-epsilon);
  } else {
    
    return 1;
    
  };
};

const box = document.getElementById('input1');

function triggerShake(){
  box.classList.add("shake");
  box.addEventListener("animationend", () => {
    box.classList.remove("shake");
  }, {once: true});
};



//starting index of script

let index = 0
const heightDisplay = document.getElementById("height")



inputElement.addEventListener("keydown", 
  async function (event) {
    
    // console.log("Regex:")
    
    let allowed = new Boolean;

    // return is used to exit the function (don't bother if the key isn't enter)
    if (event.key !== 'Enter') return;

    // prevents browser from fucking with form
    event.preventDefault();
    // separator
    const valueNoTrim = "✦ "+inputElement.value;
    
    // remove whitespaces
    const value = inputElement.value.trim();

    // return if empty
    if (!value) return;

    //regex logging
    console.log(value+ "detected as: " + eld.detect(value).language);
    // console.log((whitelistRegex.test(value.toLowerCase)));
    // console.log(((eld.detect(value).language !== "en") && (whitelistRegex.test(value.toLowerCase)===false )));
    // console.log(blacklistRegex.test(value.toLowerCase()));
    // console.log((value.toLowerCase().replace(/\s/g,"")));
     
    // actual gizmo
    // console.log(value);

    checkInput(value);
    const result = await classifier(value);

    let sentiment = result[0];
    console.log(sentiment);
    // document.getElementById("sentiment").innerText=`label: ${sentiment.label} confidence: ${sentiment.score.toFixed(4)}`;
      
    if (((sentiment.score > params.threshold) && !globalProfanityBool)&& sentiment.label === "POSITIVE") {
      allowed = true;
      let valueLen = 0;
      let id = index
      for (let i = 0; i < valueNoTrim.length; i++){
        let char = valueNoTrim.charAt(i);
        // console.log("opacity:" + opacity math (12*Math.pow(sentiment.score,128)-11)); 
        SpiralAppend(char,i+index,id);
        
        
        valueLen ++;
      };
      index += valueLen + 1;
      heightDisplay.innerText = `Height: ${index/100}m`
      document.documentElement.style.setProperty('--offset',index-300);


    } else {
      triggerShake()
      allowed = false;
    };

      // == debug logging ==
      // console.log("allowed: " + allowed)
      // console.log("no swear: " + !globalProfanityBool)
      // console.log("threshold: " + params.threshold)
      // console.log("high nuff: " + (sentiment.score > params.threshold))
      // console.log("id: " + event.target.id)
    // document.getElementById("verdict").innerHTML=displayAllowed(allowed, event.target.id);

    

    inputElement.value="";
    // Snitch()
    console.log(document.documentElement.style.setPropertyValue('--displayMode'))
    
})

document.addEventListener('keydown', function key(e) {
  if (e.key === '`') {
    const current = getComputedStyle(document.documentElement).getPropertyValue('--displayMode').trim();
    const next = current === 'visible' ? 'hidden' : 'visible';
    document.documentElement.style.setProperty('--displayMode', next);
  }
});

