const cells=document.querySelectorAll('.cell')
const titleHeader=document.querySelector('#titleHeader')

const xPlayer=document.querySelector('#xPlayerDisplay')
const oPlayer=document.querySelector('#oPlayerDisplay')

const restartBtn=document.querySelector('#restartBtn')
const startTimerBtn=document.querySelector('#startTimerBtn')

const timerEl=document.querySelector('#timer')

const modeBtns=document.querySelectorAll('.modeBtn')
const levelBtns=document.querySelectorAll('.levelBtn')

const board=document.querySelector('#board')





// GAME DATA

let player='X'
let isPause=false
let isGameStart=false

let mode=null
let level=null

let input=['','','','','','','','','']

let timer
let time=5


// TIME BY LEVEL

const levelTime={
easy:8,
medium:5,
hard:3
}


// WIN CONDITIONS

const wins=[

{c:[0,1,2],l:{top:42,left:0,a:0}},
{c:[3,4,5],l:{top:141,left:0,a:0}},
{c:[6,7,8],l:{top:240,left:0,a:0}},

{c:[0,3,6],l:{top:0,left:42,a:90}},
{c:[1,4,7],l:{top:0,left:141,a:90}},
{c:[2,5,8],l:{top:0,left:240,a:90}},

{c:[0,4,8],l:{top:0,left:0,a:45}},
{c:[2,4,6],l:{top:0,left:260,a:135}}

]


// MODE

modeBtns.forEach(b=>{

b.onclick=()=>{

modeBtns.forEach(x=>x.classList.remove('selected'))

b.classList.add('selected')

mode=b.dataset.mode

ready()

}

})


// LEVEL

levelBtns.forEach(b=>{

b.onclick=()=>{

levelBtns.forEach(x=>x.classList.remove('selected'))

b.classList.add('selected')

level=b.dataset.level

ready()

}

})


// PLAYER

function choosePlayer(p){

if(isGameStart) return

player=p

xPlayer.classList.remove('player-active')
oPlayer.classList.remove('player-active')

if(p==='X'){
xPlayer.classList.add('player-active')
}else{
oPlayer.classList.add('player-active')
}

ready()

}


// READY

function ready(){

if(player && mode && level){

titleHeader.textContent="Ready 🎮"

}

}


// START TIMER

startTimerBtn.onclick=()=>{

if(!player||!mode||!level){

alert("Select All Options First!")
return
}

isGameStart=true

titleHeader.textContent="Game Started 🔥"

startTimer()

}


// TIMER

function startTimer(){

clearInterval(timer)

time=levelTime[level]

timerEl.textContent=time

timer=setInterval(()=>{

time--

timerEl.textContent=time

if(time===0){

lose()

}

},1000)

}


// LOSE

function lose(){

clearInterval(timer)

titleHeader.textContent=player+" Lost ⏱️"

isPause=true

restartBtn.style.visibility='visible'

}


// CELL CLICK

cells.forEach((c,i)=>{

c.onclick=()=>{

if(!isGameStart||isPause) return

if(input[i]!=='') return

play(i)

}

})


// PLAY

function play(i){

input[i]=player

cells[i].textContent=player

cells[i].style.color= player==='X'?'#00D9FF':'#00FF9C'

if(check()) return

switchPlayer()

startTimer()

if(mode==='cpu' && player==='O'){

setTimeout(cpu,500)

}

}


// SWITCH

function switchPlayer(){

player= player==='X'?'O':'X'

}


// CPU

function cpu(){

if(isPause) return

let empty=[]

input.forEach((v,i)=>{

if(v==='') empty.push(i)

})

let r=empty[Math.floor(Math.random()*empty.length)]

play(r)

}


// CHECK

function check(){

for(let d of wins){

let[a,b,c]=d.c

if(

input[a]===player &&
input[b]===player &&
input[c]===player

){



mark([a,b,c])

end()

return true

}

}

if(input.every(v=>v!=='')){

titleHeader.textContent="Draw 😐"

isPause=true

restartBtn.style.visibility='visible'

clearInterval(timer)

return true

}

}


// HIGHLIGHT

function mark(arr){

arr.forEach(i=>{

cells[i].classList.add('win')

})

}


// END

function end(){

titleHeader.textContent=player+" Wins 🎉"

isPause=true

restartBtn.style.visibility='visible'

clearInterval(timer)

}


// RESTART

restartBtn.onclick=()=>{

input.fill('')

cells.forEach(c=>{

c.textContent=''
c.classList.remove('win')

})

winLine.style.display='none'

restartBtn.style.visibility='hidden'

isPause=false
isGameStart=false

player='X'
mode=null
level=null

timerEl.textContent='--'

clearInterval(timer)

titleHeader.textContent="Choose"

modeBtns.forEach(b=>b.classList.remove('selected'))
levelBtns.forEach(b=>b.classList.remove('selected'))

xPlayer.classList.remove('player-active')
oPlayer.classList.remove('player-active')

}
