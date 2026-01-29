let currentIndex = 0;
let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
  currFolder = folder
  let a = await fetch(`/${folder}/`)
  let result = await a.text();

  let div = document.createElement("div")
  div.innerHTML = result
  let as = div.getElementsByTagName("a")

  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1].split(".mp3")[0])
    }
  }
  let songsUL = document.querySelector(".l-cont").getElementsByTagName("ol")[0]
  songsUL.innerHTML = " ";
  for (const song of songs) {
    songsUL.innerHTML = songsUL.innerHTML + `<li>
                            <div><img src="img/music.svg" alt=""></div>
                            <div class="p-song">${song.replaceAll("%20", " ")}</div>
                            <div class="play">Play Now<img src="img/playnow.svg" alt=""></div>
                        </li>`;
  }

  Array.from(document.querySelector(".l-cont").getElementsByTagName("li")).forEach((e, i) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".p-song").innerHTML)
      playMusic(songs[i], i)

    }
    )
  });
  return songs
}


const playMusic = (track, index, pause = false) => {
  currentIndex = index;
  currentSong.src = `/${currFolder}/` + track + ".mp3"
  if (!pause) {
    currentSong.play()
    play.src = "img/pause.svg"
  }
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
}

function secondsToMMSS(totalSeconds) {

  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const mm = minutes < 10 ? "0" + minutes : minutes;
  const ss = seconds < 10 ? "0" + seconds : seconds;


  return `${mm}:${ss}`;
}


// displaying all the albums
async function displayalbums() {
  let a = await fetch(`/songs/`)
  let response = await a.text()
  let div = document.createElement("div")
  div.innerHTML = response
  let anchors = div.getElementsByTagName("a")
  let cardcont = document.querySelector(".r-playlists")
  let array = Array.from(anchors)
  console.log(array)
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element.href.includes(`/songs/`)) {
      let folder = element.href.split("/songs/")[1]
      let a = await fetch(`/songs/${folder}/info.json`)
      let response = await a.json();
      cardcont.innerHTML = cardcont.innerHTML + `<div class="card-frame">
      <div data-folder="${folder}" class="card">
                            <div class="hoverimg">
                                <img src="img/play-hover.svg" alt="">
                            </div>
                            <div class="c-img">
                                <img src="/songs/${folder}/cover.jpg"
                                    alt="s1-img">
                            </div>
                            <div class="c-info">
                                <div class="s-name">
                                    ${response.title}
                                </div>
                                <div class="s-info">
                                    ${response.description}
                                </div>
                                </div>
                            </div>
                        </div>`
    }
  }
}



async function main() {

  songs = await getSongs("songs/pritam")
  playMusic(songs[0], 0, true)

  //calling display albums folder
  await displayalbums()



  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "img/pause.svg";
      console.log(currentSong.src.split("/songs/")[1].replaceAll("%20", " ").split(".mp3")[0] + " was played")
    }
    else {
      currentSong.pause();
      play.src = "img/play.svg"
      console.log(currentSong.src.split("/songs/")[1].replaceAll("%20", " ").split(".mp3")[0] + " was paused")
    }
  }
  )


  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = secondsToMMSS(currentSong.currentTime) + " / " + secondsToMMSS(currentSong.duration)
    console.log(secondsToMMSS(currentSong.currentTime) + " / " + secondsToMMSS(currentSong.duration))
    document.querySelector(".seekcover").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  }
  )

  // seekbar
  document.querySelector(".seekline").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

    document.querySelector(".seekcover").style.left = percent + "%"

    currentSong.currentTime = (currentSong.duration * percent) / 100
  }
  )

  // hamburger menu
  document.querySelector(".hamburger").addEventListener("click", () => {
    if (window.innerWidth <= 1200) {
      document.querySelector(".left").style.left = "0"
    }
  }
  )

  // cross on left plane 
  document.querySelector(".cross-img").addEventListener("click", () => {
    if (window.innerWidth <= 1200) {
      document.querySelector(".left").style.left = "-120%"
    }

  }
  )

  //displaying left panel when screen resizes
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
      document.querySelector(".left").style.left = "0"
    }
  }
  )
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 1200) {
      document.querySelector(".left").style.left = "-120%"
    }
  }
  )

  //previous song
  previous.addEventListener("click", () => {
    console.log("Previous was clicked")
    currentSong.pause()
    if ((currentIndex - 1) >= 0) {
      playMusic(songs[currentIndex - 1], currentIndex - 1)
    }
  }
  )

  //next song
  next.addEventListener("click", () => {
    console.log("next was clicked")
    currentSong.pause()
    if ((currentIndex + 1) < songs.length) {
      playMusic(songs[currentIndex + 1], currentIndex + 1)
    }
  }
  )

  //get albums
  Array.from(document.getElementsByClassName("card")).forEach(item => {
    item.addEventListener("click", async e => {
      console.log(e, e.currentTarget.dataset)
      songs = await getSongs(`songs/${e.currentTarget.dataset.folder}`)
      console.log(songs)
    }
    )
  });
  // autoplayes the song
  currentSong.addEventListener("ended", () => {
    if (currentIndex + 1 < songs.length) {
      playMusic(songs[currentIndex + 1], currentIndex + 1);
    } else {
      playMusic(songs[0], 0);
    }
  });

}


main()
