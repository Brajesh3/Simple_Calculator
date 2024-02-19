// Created by Brajesh

window.addEventListener("load",init);

function* IDGenerator(){
    let count = 0;
    while(true){
        yield count++;
    }
}

const IDGen = IDGenerator();


const AppState = {
    exp : "",
    result : "",
    showResult : false,
    lastChar : "",
    history : []
};

function init(){
    setTimeout(()=>{
        togglePanel(true);
    },300);
    genKeypad();
}

function toggleTheme(){
    let cur = qs("body").dataset.theme ;
    qs("body").dataset.theme = 
    cur === "dark" ? "light" : "dark";
}

function genKeypad(){
    const keys = "789×456÷123-.0=+";
    let keypad = qs(".keypad");
    for(key of keys){
        let s = "";
        if("+×÷-.=".includes(key)) s = "op"
        keypad.innerHTML += `
        <div class="key ${s}" 
             onclick="press('${key}')"
        >
            ${key}
        </div>`;
    }
}

function togglePanel(state="$SENTINEL"){
    let curState = qs(".panel").dataset.show ;
    if(state==="$SENTINEL")
        state = curState === "true" ? "false" : "true" ;
    qs(".panel").dataset.show = state ;
}

function press(key){
    AppState.lastChar = key ;
    if(key === "="){
        try {
            AppState.result = 
            eval(formatExp(AppState.exp)); ;
        } catch(err) {
            AppState.result = "ERROR" ;
        }
        AppState.history.push({
            id  : IDGen.next().value,
            exp : AppState.exp,
            res : AppState.result
        });
        AppState.showResult = true;
    } else if(key === "on"){
        AppState.exp = "";
        AppState.result = "";
        AppState.showResult = false;
        AppState.lastChar = "";
        AppState.history = [];
    }else if(key === "back"){
        if(AppState.showResult) return;
        AppState.exp = AppState.exp
        .substring(0,AppState.exp.length-1);
    } else if(key === "()"){
        
    } else {
        if(AppState.showResult) {
            AppState.exp = "";
            AppState.result = "";
            AppState.showResult = false;
            AppState.lastChar = "";
        }
        AppState.exp += key ;
    }
    
    update();
}

function formatExp(exp){
    let str = exp;
    str = str.replace(/×/g,"*");
    str = str.replace(/÷/g,"/");
    return str;
}

function update(){
    qs("#exp").innerText = AppState.exp ;
    qs("#result").innerText = AppState.result ;
    qs("#scr").dataset.showResult = AppState.showResult ;
    updateHistory();
}

function updateHistory(){
    let hp = qs(".history-panel .body");
    hp.innerHTML = "";
    AppState.history.forEach((h)=>{
        hp.innerHTML += historyCard(h);
    });
}

function historyCard(h){
    return `
<div class="card">
    <div class="content">
         <div class="exp">
             ${h.exp}
         </div>
         <div class="result">
             ${h.res}
         </div>
     </div>
     <div class="delete" onclick="remove(${h.id})" data-icon="trash-icon">
     <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M4 7l16 0" />
  <path d="M10 11l0 6" />
  <path d="M14 11l0 6" />
  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
</svg>
     </div>
</div>`;
}

function remove(id){
    AppState.history = AppState.history.filter(h => h.id !== id)
    update();
}
