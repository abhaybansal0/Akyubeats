console.log("Welcome To AkyuBeats");

let currentSong = new Audio();
let currentTime;

let currSongData = {
    title: '',
    number: 0
};
let songs = [];



async function getSongs(playlist) {

    let a = await fetch("/Songs/" + `${playlist}`)
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
            let pair = [];
            const un_name = element.href.split(`/Songs/${playlist}/`)[1].split(".")[0];

            pair.push(un_name.split('-')[1]); //song name
            pair.push(un_name.split('-')[0]);   // song artist
            pair.push(element.href.split(`/Songs/${playlist}/`)[1]); // full song name with %20 (track)
            pair.push(`${playlist}`);    //folder name

            songs.push(pair);
        }
    }

    try {
        let boo = false;
        if(!currentSong.paused){boo = true;}
        let start = await playMusic(songs[0][3], songs[0][2]);
        currSongData.number = 0;
        document.getElementById("play_pause").classList.remove("hidden");
        document.getElementById("pause_play").classList.add("hidden");

        if(boo){play_song();
            boo=false;
        }
    } catch (e) {
        throw e;
    }

    if(!document.querySelector(".ham").classList.contains("hidden")){
        document.querySelector(".left").style.left = "0%";
        document.querySelector(".ham").classList.toggle("rotate")
    }


    console.log(songs);

    return songs;
}



async function playMusic(folder, track) {

    document.getElementById("play_pause").classList.remove("hidden");
    document.getElementById("pause_play").classList.add("hidden");


    folder = folder.replaceAll(" ", "%20");
    track = track.replaceAll(" ", "%20");
    currentSong.src = `/Songs/${folder}/` + track;
    currentSong.currentTime = 0;


    console.log(currentSong.src);
    document.getElementById("scro_s_name").innerHTML = track.replaceAll("%20", ' ').split(".")[0];

    // currentSong.play();

    return currentSong.duration;
}



async function nextSong() {

    if (document.getElementsByName("ul").innerHTML !== '') {
        let next_num = currSongData.number + 1;
        if (songs.length > next_num) {
            track = songs[next_num][2];
            folder = songs[next_num][3];

            let set = await playMusic(folder, track);
            play_song();
            currSongData.number = next_num;
            console.log("song was skipped", next_num);
        }
    }
}

async function previousSong() {
    if (document.getElementsByName("ul").innerHTML !== '') {
        let prev_num = currSongData.number - 1;
        if (prev_num >= 0) {
            track = songs[prev_num][2];
            folder = songs[prev_num][3];
            let set = await playMusic(folder, track);
            play_song();
            currSongData.number = prev_num;
        }
    }
}



async function play_song() {
    document.getElementById("play_pause").classList.add("hidden"); // arrwoing btn
    document.getElementById("pause_play").classList.remove("hidden");  // parallel button
    if(currentSong.src !== ''){
        currentSong.play();
    }
    
}
async function pause_song() {
    document.getElementById("play_pause").classList.remove("hidden"); // arrwoing btn
    document.getElementById("pause_play").classList.add("hidden");  // parallel button
    if(currentSong.src !== ''){
        currentSong.pause();
    }
    
}




function upd_timer() {
    if (currentSong.currentSrc !== '') {

        const totaltime = currentSong.duration;
        let t_display = document.getElementById("timer");

        let mins = Math.floor(totaltime / 60);
        let secs = Math.floor(totaltime % 60);
        //Setting the Timer
        const currtime = currentSong.currentTime;
        let mins2 = Math.floor(currtime / 60);
        let secs2 = Math.floor(currtime % 60);

        t_display.innerHTML = `${mins2}:${secs2} / ${mins}:${secs}`;
        // console.log(`${mins2}:${secs2} / ${mins}:${secs}`);

        document.querySelector(".circle").style.left = (currtime / totaltime) * 100 + '%';

    }
}
setInterval(() => {
    upd_timer();
}, 1000);



//////////////////////////// MAIN Function

async function main() {
    let songs = [];


    // //get the list of all the songs
    // let songs = await getSongs();
    // console.log(songs);
    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async function () {

            let playlist = e.getElementsByTagName("h3")[0].innerHTML.replaceAll(" ", "%20");
            songs = await getSongs(playlist);
            // console.log(songs);


            // Show all the songs in the playlist
            let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];

            songUL.innerHTML = '';
            let number = 0;
            for (const song of songs) {
                songUL.innerHTML = songUL.innerHTML + `
                    <li>
                        <img src= "/SVGs/music.svg" alt="" class= "spell">

                        <div class="info" data-title= "${song[2]}" data-folder= "${song[3]}" data-number="${number}">

                            <div class="songname">${song[0].replaceAll("%20", " ")}</div>
                            <div>${song[1].replaceAll("%20", " ")}</div>

                        </div>
                            
                        <img src="/SVGs/playnow.svg" alt="" class="playkrbe">

                    </li>`;
                number++;
            }


            //Attatch an event listener to each song
            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

                e.addEventListener("click", async () => {
                    // console.log("${element} Should Start Playing");
                    console.log("This song was Clicked");
                    
                    const song_clicked = e.querySelector(".info");
                    console.log(song_clicked);

                    currSongData.number = song_clicked.dataset.number;

                    let set = await playMusic(song_clicked.dataset.folder, song_clicked.dataset.title);
                    play_song();

                    

                    console.log(song_clicked.dataset.title, currSongData.number);

                })
            })
        })

    })



    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("mouseover", function () {
            e.firstElementChild.classList.toggle("bringplay");
        })                                                                             //Card Hover Animation
        e.addEventListener("mouseout", function () {
            e.firstElementChild.classList.toggle("bringplay");
        })
    })


    

    document.getElementById("play_pause").addEventListener("click", ()=>{
        console.log("dont kick me");
        
        play_song();
    });
    document.getElementById("pause_play").addEventListener("click", ()=>{
        console.log("dont kick me");

        pause_song()
    });                                                                                 // Play & Pause Btn



    document.getElementById("skipp_before").addEventListener("click", e => {
        previousSong();
        currentSong.addEventListener("canplaythrough", e => {
            play_song();
        });
    })                                                                                  // Previous and Next Song
    document.getElementById("skipp_ahead").addEventListener("click", e => {
        nextSong();
        currentSong.addEventListener("canplaythrough", e => {
            play_song();
        });
    })



    document.getElementById("loop_p").addEventListener("click", e => {
        document.getElementById("loop_p").classList.toggle("hidden");
        document.getElementById("loop_s").classList.toggle("hidden");
    })                                                                          // Loop Button Switch
    document.getElementById("loop_s").addEventListener("click", e => {
        document.getElementById("loop_s").classList.toggle("hidden");
        document.getElementById("loop_p").classList.toggle("hidden");
    })


    setInterval(() => {
        let elem = document.getElementById("loop_p").classList;

        if (elem.contains('hidden')) {
            if (currentSong.src != '' && currentSong.duration - currentSong.currentTime < 2) {
                currentSong.addEventListener("ended", () => {
                    play_song();
                })
            }                                                                                      // Loop Functioning
        }
        else {
            if (currentSong.src !== '' && currentSong.duration - currentSong.currentTime < 2) {
                currentSong.addEventListener("ended", async () => {
                    let fuck = await nextSong();
                    play_song();
                })
            }
        }
    }, 2000);


    // add an eventlistener to seak bar

    document.querySelector(".seakbar").addEventListener("click", e => {

        if (currentSong.src !== "") {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width * 100)
            let percentage = document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width * 100) + '%';
            // console.log(percentage);

            let total = currentSong.duration;
            currentSong.currentTime = percent * total / 100;
            // console.log(currentSong.currentTime);
        }
    })


    document.querySelector(".ham").addEventListener("click", function () {
        document.querySelector(".left").style.left = "0%";
        this.classList.toggle("rotate");
    })
    document.querySelector(".cross").addEventListener("click", function() {
        document.querySelector(".left").style.left = "-100%";
        this.classList.toggle("rotate2");
    })
}


main();

