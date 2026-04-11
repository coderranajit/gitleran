document.addEventListener("DOMContentLoaded",()=>{
    let bigPlayBtn = document.getElementById("play");
    let gifDisplay = document.getElementById("gif");
    let songlist = document.getElementById("songlist");
    let progressBar = document.getElementById("range");
    let currentTime = document.getElementById("current-time");
    let durationTime = document.getElementById("duration-time");
    let backwardBtn = document.getElementById("backwardButton");
    let forwardBtn = document.getElementById("forwardButton");
    let shuffle = document.getElementById("no-shuffle");
    let repeate = document.getElementById("noRepeate");
    let isShuffle = false;
    let isRepeate = false;

    //After clicking it the songs will autometically forwarding
    shuffle.addEventListener("click", () => {
      isShuffle = !isShuffle;
      shuffle.src = isShuffle ? "Shuffle1.png" : "noShuffle1.png";
      
    });

    //To repeate the song itself
    repeate.addEventListener('click',()=>{
        isRepeate = !isRepeate;
        repeate.src = isRepeate?"repeate1.png":"noRepeate1.png";
        audio.loop = isRepeate; //loop is the property that repeate the song it self
    });

    let songIndex = 0;
    
    gifDisplay.classList.add("hidden");
    
    let audio = new Audio();
    let currentSmallBtn = null;

    let songItems = [
        {name : "amay aktu jayga dao",src : "amay-aktu-jayga-dao.mp3", id : Date.now()},
        {name : "Basan paro maa",src : "Basan paro maa.mp3", id : Date.now()},
        {name : "dosh karor noi go maa",src : "dosh karor noi go maa.mp3", id : Date.now()},
        {name : "Dui jonom dhore hetechi",src : "Dui jonom dhore hetechi.mp3", id : Date.now()},
        {name : "Jhokher jole dhoabo ma",src : "Jhokher jole dhoabo ma.mp3", id : Date.now()},
        {name : "ma tor koto rongo dekhbo bol",src : "ma tor koto rongo dekhbo bol.mp3", id : Date.now()},
        {name : "maer paer joba",src : "maer paer joba.mp3", id : Date.now()},
        {name : "Shyama ma ki amar kalo",src : "Shyama ma ki amar kalo.mp3", id : Date.now()},
        {name : "sastra",src : "sastra.mp3", id : Date.now()},
        {name : "sokoli tomari echha",src : "sokoli tomari echha.mp3", id : Date.now()},
        {name : "Tui naki ma daya mai",src : "Tui naki ma daya mai.mp3", id : Date.now()},
    ]
    //To loop over the songs,adding list
    songItems.forEach((song,index)=>{
      let li = document.createElement("li");
      li.classList.add("lists");
      li.innerHTML = `
        <span class="index">${index+1})</span>
        <span>${song.name}</span>
        <i><img src="playButtonIcon1.png" alt="play" class="smallPlayBtn" id="${song.id}"></i>
        `;
      let smallPlayBtn = li.querySelector(".smallPlayBtn");
      //store the source of song after clicking it
      smallPlayBtn.addEventListener("click", (e) => {
        let clickedSrc = song.src;
        songIndex = index;//take the index of the song

        //If clicked a new song
        //encodeURL help to browser to read the file correctly
        //audio.src is the currently playing song
        //clickedSrc is the currently clicked song
        if(!audio.src.includes(encodeURI(clickedSrc))){
            audio.src = clickedSrc;//store the currently clicked song in audio.src
            audio.play();
        }

        //To reset the previous small button
        if (currentSmallBtn){
            currentSmallBtn.src = "playButtonIcon1.png";
        }

        //currently targeted Btn
        currentSmallBtn = e.target;
        if (audio.paused || audio.currentTime<=0) {
          audio.play();
          e.target.src = "pause.webp";

          updateIcons(true);
        } else {
          audio.pause();
          e.target.src = "playButtonIcon1.png";
          updateIcons(false);
        }  
    });
    songlist.appendChild(li);
    });

    //Work with backward Btn
    backwardBtn.addEventListener('click',()=>{
        if(songIndex == 0) return;
        songIndex-=1;
        playTargetSong();  
    });

    //Work with forward Btn
    forwardBtn.addEventListener('click',()=>{
        if(songIndex >= songItems.length) return;
        songIndex+=1;
        playTargetSong();   
    });

    // Target a small Btn and play song (pre or post)
    function playTargetSong() {
        audio.src = songItems[songIndex].src;
        audio.play();
        //To get back in play icon
        if(currentSmallBtn) currentSmallBtn.src = "playButtonIcon1.png";
        let allSmallBtns = document.querySelectorAll(".smallPlayBtn");//To get referance of all small Btn
        currentSmallBtn = allSmallBtns[songIndex];//Store the playing song's Btn
        updateIcons(true);//To update the BigPlayBtn
    }

    bigPlayBtn.addEventListener("click", () => {
      if(!audio.src) return; //If no song is selected then the big play button will not work
      if (audio.paused) {
        audio.play();
        updateIcons(true);
      } else {
        audio.pause();
        updateIcons(false);
      }
    });


    function updateIcons(isPlaying) {
      if (isPlaying) {
        bigPlayBtn.src = "pause.webp";
        if(currentSmallBtn) currentSmallBtn.src = "pause.webp";
        gifDisplay.classList.remove("hidden");

      } else {
        bigPlayBtn.src = "playButtonIcon1.png";
        if(currentSmallBtn) currentSmallBtn.src = "playButtonIcon1.png";
        gifDisplay.classList.add("hidden");
      }
    }
    //To update the max value of the progress bar
    //Without using this event time duration will be NaN
    audio.addEventListener('loadedmetadata',()=>{
        progressBar.max = audio.duration;
        // to show the length the song
        durationTime.innerHTML = formatTime(audio.duration);
    })

    //Update seekBar
    audio.addEventListener('timeupdate',()=>{
        progressBar.value = audio.currentTime;
        //To show the time progress
        currentTime.innerHTML = formatTime(audio.currentTime);
    })

    progressBar.addEventListener('input',()=>{
        audio.currentTime = progressBar.value;
    })
    //to update the icon and progressBar after complete the song
    audio.onended = ()=>{
        updateIcons(false);
        progressBar.value = 0;// ProgressBar will appear at initiial position
        durationTime.innerHTML = formatTime(0);
        currentTime.innerHTML = formatTime(0);
        if (isShuffle) {
        forwardBtn.click(); //To automate forwarding
        }    
    }


    //time formater
    function formatTime(time) {
        let min = Math.floor(time/60);
        let sec = Math.floor(time%60);
        if(sec<10) sec = `0${sec}`;//To format the second
        return `0${min}:${sec}`;
    }
})
