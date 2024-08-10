let audio = new Audio(" ");
let playimg1 = document.querySelector(".playsongs .playcircle");
let cardsongname = document.querySelector("div .songname");
let currsong = null;
let songs = [];
const availableFolders = {
  Favourites: ["Taur-Mundeya-Di.mp3", "Unstopabble.mp3"],
  Recent: ["Unstoppable.mp3","Meri_Aashiqui.mp3"],
};

updatefolders();

function updatefolders() {
  let playlistCard = Object.keys(availableFolders).map(
    (e) => `<div class="card pointer" data-folder=${e}>
  <img src="images/perfectimage.jpg" alt="Ashiqui" class="card-img">
  <h2>${e}</h2>
  <p style="color:grey">Love Music , Feel the Music</p>
  <img src="images/playbtn.svg" alt="play" class="playbtn">
</div>`
  );
let keys = Object.keys(availableFolders)
getFolder(keys[0]);
  document.querySelector(".cardcontainer").innerHTML += playlistCard;
  Array.from(document.querySelectorAll(".card")).forEach((e) =>
    e.addEventListener("click", (e) => {
      folder = e.currentTarget.getAttribute("data-folder");
      getFolder(folder);
    })
  );
}
// Function to fetch the playlist for the selected folder
function getFolder(folderName) {
  folder = folderName;
  fetch(`/songs/${folder}`)
    .then((res) => res.text())
    .then((data) => getdata(folderName))
    .catch((err) => console.log("Network problem:", err));
}

// Function to process and display the data
function getdata(folderName) {
  // Clear the previous playlist
  document.querySelector(".playsongslist").innerHTML = "";
  audio.pause();
  document.querySelector(".currentpos").style.left = `${2}%`;

  let songsOfFolder = availableFolders[folderName];
  // Generate new playlist HTML
  let songUl = songsOfFolder
    .map(
      (e) => `
    <div class="playcard pointer">           
      <img src="images/music-note-03-stroke-rounded.svg" alt="music" width="30px">
      <ul>
        <li>${e}</li>
      </ul>
      <div class="flex items-align">
        <span>Play</span>
        <img src="images/play-circle-02-stroke-rounded.svg" alt="play" class='invert' id='imgplay' width="30px">
      </div>
    </div>
  `
    )
    .join(" ");
   

  // Play the first song in the new playlist
  playmusic(songsOfFolder[0], true);

  // Append new playlist
  document.querySelector(".playsongslist").innerHTML += songUl;

  // Add event listeners to new playcards
  Array.from(document.querySelectorAll(".playcard")).forEach((card) => {
    card.addEventListener("click", () => {
      const songElement = card.querySelector("ul li");
      playmusic(songElement.textContent);
    });
  });

  // Set up play/pause button
  playimg1.addEventListener("click", togglePlayPause);

  // Set up time update
  audio.addEventListener("timeupdate", updateTime);

  // Set up seek bar
  document.querySelector(".seekbar").addEventListener("click", seek);

  // Set up next and previous buttons
  document.querySelector(".next").addEventListener("click", nextSong);
  document.querySelector(".prev").addEventListener("click", prevSong);

  // Set up hamburger and cross menu buttons
  document.querySelector(".hamburger").addEventListener("click", openMenu);
  document.querySelector(".cross").addEventListener("click", closeMenu);
}

// Function to play music
function playmusic(song, pause = false) {
  if (song) {
    audio.src = `/songs/${folder}/${song}`;
    currsong = song;
    if (!pause) {
      audio.play().catch((err) => console.log("Wait to play:", err));
      playimg1.src = "images/pause-stroke-rounded.svg";
    }
    document.querySelector("div.songname").innerHTML = (`${song}`);
    document.querySelector(".songduration").innerHTML = "00:00 / 00:00";
    if (audio.paused) {
      playimg1.src = "images/play-circle-02-stroke-rounded.svg";
    } else {
      playimg1.src = "images/pause-stroke-rounded.svg";
    }
  }
}

// Function to toggle play/pause
function togglePlayPause() {
  if (audio.paused) {
    audio.play().catch((err) => console.log("Error playing audio:", err));
    playimg1.src = "images/pause-stroke-rounded.svg";
  } else {
    audio.pause();
    playimg1.src = "images/play-circle-02-stroke-rounded.svg";
  }
}

// Function to update the time display
function updateTime() {
  document.querySelector(".songduration").innerHTML = `${convertTime(
    audio.currentTime
  )} / ${convertTime(audio.duration)}`;
  if (audio.duration > 0) {
    const percentage = (audio.currentTime / audio.duration) * 94.5;
    document.querySelector(".currentpos").style.left = `${percentage + 2}%`;
  }
}

// Function to seek through the song
function seek(e) {
  const percentage =
    (e.offsetX / e.target.getBoundingClientRect().width) * 94.5;
  document.querySelector(".currentpos").style.left = `${percentage + 2}%`;
  const newTime = (percentage / 94.1) * audio.duration;
  audio.currentTime = newTime;
}

// Function to play the next song
function nextSong() {
  let index = songs.indexOf(currsong);
  if (index < songs.length - 1) {
    index += 1;
  } else {
    index = 0;
  }
  audio.pause();
  playmusic(songs[index]);
}

// Function to play the previous song
function prevSong() {
  let index = songs.indexOf(currsong);
  if (index > 0) {
    index -= 1;
  } else {
    index = songs.length - 1;
  }
  audio.pause();
  playmusic(songs[index]);
}

// Function to open the menu
function openMenu() {
  document.querySelector(".left-container").style.left = "0%";
}

// Function to close the menu
function closeMenu() {
  document.querySelector(".left-container").style.left = "-100%";
}

// Function to convert time in seconds to MM:SS format
function convertTime(seconds) {
  seconds = Number(seconds);
  if (isNaN(seconds)) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}