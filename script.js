console.log("hello i am javascript")
let currentsong = new Audio();
let songs
let currentfolder
//seconds to minutes convertion
function convertSecondsToMMSS(sec) {
    if (isNaN(sec) || sec < 0) {
        return "00:00"

    }
    const min = Math.floor(sec / 60);
    const remainingSec = Math.floor(sec % 60);

    const formatmin = String(min).padStart(2, '0');
    const formatsec = String(remainingSec).padStart(2, '0');

    return `${formatmin}:${formatsec}`

}
async function getsongs(folder) {
    currentfolder=folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    console.log(songs)

        //show all the songs in library
        let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
        songul.innerHTML=""
        for (const song of songs) {
            songul.innerHTML = songul.innerHTML + `<li>
                          
                                <img class="invert" src="music.svg" alt="">
                                <div class="info">
                                    <div>
                                    ${song.replaceAll("%20", "")}
                                    </div>
                                </div>
                                
            </li>`
        }
    
        //attaching eventlistener to every song
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                console.log(e.querySelector(".info").firstElementChild.innerHTML)
                playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })
    return songs
}
const playmusic = (track,pause=false)=> {
    // let audio=new Audio("/songs/" + track)

    currentsong.src = `/${currentfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
        
        
   
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}
async function displayalbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        
        if (e.href.includes("/songs/")) {
            let folder=e.href.split("/").slice(-1)[0]
            //get the meta data of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response=await a.json();
            console.log(response)
            cardcontainer.innerHTML=cardcontainer.innerHTML  + `<div data-folder="${folder}"  class="card ">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">

                                <circle cx="12" cy="12" r="12" class="bg-circle" />
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    class="icon-path" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="telugu">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        } }
    //loading playlists when ever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click",async item=>{
            songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })
     })}


   

async function main() {

    //get the list of all songs
   await getsongs("songs/cs")
    console.log(songs)
    playmusic(songs[0],true)

    //display albums
    displayalbums()
   

    //attach an event listner to play,next and previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    //listen for time update event
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMMSS(currentsong.currentTime)}:${convertSecondsToMMSS(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 + "%"
    })
    //add event listner to seek bar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width) * 100 
        console.log(e.target.getBoundingClientRect().width, e.offsetX)
        document.querySelector(".circle").style.left = percent+ "%"
        currentsong.currentTime=((currentsong.duration)* percent)/100
    })
    //add event listner to previous
    previous.addEventListener("click",()=>{
        console.log("previous clicked")
        console.log(currentsong.src.split("/").slice(-1)[0])
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index-1)>=0) {
            playmusic(songs[index-1])
            
        }
    })
    //add event listner to next
   next.addEventListener("click",()=>{
    console.log("next clicked")

    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    console.log(currentsong.src.split("/").slice(-1)[0])
    
    if ((index+1)<songs.length) {
        playmusic(songs[index+1])
        
    }
    })
    
}
main()





