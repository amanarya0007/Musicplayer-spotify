let currentIndex = 0;
let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
  currFolder = folder;
  let res = await fetch(`/${folder}/songs.json`);
  songs = await res.json();

  let songsUL = document.querySelector(".l-cont ol");
  songsUL.innerHTML = "";

  for (let song of songs) {
    songsUL.innerHTML += `
      <li>
        <div><img src="img/music.svg"></div>
        <div class="p-song">${song}</div>
        <div class="play">Play Now <img src="img/playnow.svg"></div>
      </li>
    `;
  }

  Array.from(songsUL.getElementsByTagName("li")).forEach((e, i) => {
    e.addEventListener("click", () => {
      playMusic(songs[i], i);
    });
  });

  return songs;
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
  let res = await fetch("/songs/albums.json");
  let albums = await res.json();

  let cardcont = document.querySelector(".r-playlists");
  cardcont.innerHTML = "";

  for (let album of albums) {
    cardcont.innerHTML += `
      <div class="card-frame">
        <div data-folder="${album.folder}" class="card">
          <div class="hoverimg">
            <img src="img/play-hover.svg" alt="">
          </div>
          <div class="c-img">
            <img src="/songs/${album.folder}/${album.cover}">
          </div>
          <div class="c-info">
            <div class="s-name">${album.title}</div>
            <div class="s-info">${album.description}</div>
          </div>
        </div>
      </div>
    `;
  }

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", async e => {
      songs = await getSongs(`songs/${e.currentTarget.dataset.folder}`);
      playMusic(songs[0], 0);
    });
  });
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
