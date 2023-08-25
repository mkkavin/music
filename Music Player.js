	
const docImage= document.getElementById("image");
const music= document.getElementById("music");
const play= document.getElementById("play");
const forward= document.getElementById("forward");
const backward= document.getElementById("backward");
const docTitle= document.querySelector('.title h1');
const docArtist= document.querySelector('.artist h2');
const playlist= document.querySelector('#playlist');


player={ playing:false,musicIndex:0,isMute:0};
let list_songs=[
{
	title:"Beast-Theme",
	artist: "Vijay-Anirudh",
	image:"download"
	},
	{
	title:"Chellamma",
	artist: "SK-Anirudh",
	image:"download (2)"
	},
	{
	title:"Kutti Story",
	artist: "vijay-Anirudh",
	image:"download (1)"
	},
	{
	title:"Master the Blaster",
	artist: "vijay-Anirudh",
	image:"download (4)"
	},
	{
	title:"Valimai-Theme",
	artist: "Ajith-U1",
	image:"download (3)"
	}
];

//Load 1st song 
setMusicIndex(0);

//Set initial volume to full
$("#volume-bar").css('width', '100%');



//create playlist
$(document).ready(function() {
	
list_songs.forEach((item,index) => {

	//create playlist item
	let song= document.createElement('div');
	song.innerHTML=item.title;
	song.classList.add("p-3","playlist-item");

	//set id to music's index according to list_songs index
	song.setAttribute("id", `item-${index}`);
	playlist.append(song);
	})
});


//update current time and duration
music.addEventListener("timeupdate",(event) => {

	//Convert Current Time to minute & seconds using Music object
	let currentPlayingTime= Math.floor($(music)[0].currentTime);
	let currentMinute=  Math.floor(currentPlayingTime/60);
	let currentSecond = currentPlayingTime%60;

	//convert song Duration to minute & seconds
	let showTotalDuration= Math.floor($(music)[0].duration) ;
	let showTotalMin= Math.floor(showTotalDuration/60);
	let showTotalSec= showTotalDuration%60;

	//If current time is <10 then add '0' to seconds
	if(currentSecond <10){
		currentSecond= "0"+currentSecond;
	}

	$("#current-time").html(`${currentMinute}:${currentSecond}`);
	$("#total-duration").html(`${showTotalMin}:${showTotalSec}`);


	//Progress Bar
	let songCompletePercent= (currentPlayingTime/showTotalDuration)*100;
	$("#progress-bar").css('width', `${songCompletePercent}%`);

});


//Progress Bar clicked
$("#progress-div").click(function(event) {
	
	//Get position from left where clicked using event object
	let clickPosition=event.originalEvent.clientX ; // This position is wrt to window, so we'll also need progress div's position from left
	let progressDivPosition=$("#progress-div")[0].offsetLeft;
	let progressDivWidth= $("#progress-div").width();

	//subtract both to get click position wrt progress-div and convert to %, by dividing with width of progress-div 
 	let progressPercentage= Math.round(((clickPosition - progressDivPosition)/progressDivWidth)*100);
	console.log(progressPercentage+'%');

	//skip to new time according to % of total duration, converting to seconds
	let newTime= progressPercentage*(Math.floor($(music)[0].duration))/100 ;
	//Set new time
	$(music)[0].currentTime=newTime;		
	
});


//Volume Bar clicked
$("#volume-div").click(function(event) {
	
	//Get position from left where clicked using event object
	let clickPosition=event.originalEvent.clientX ; // This position is wrt to window, so we'll also need progress div's position from left
	let volumeDivPosition=$("#volume-div")[0].offsetLeft;
	let volumeDivWidth= $("#volume-div").width();

	//subtract both to get click position wrt progress-div and convert to %, by dividing with width of progress-div 
 	let progressPercentage= Math.ceil(((clickPosition - volumeDivPosition)/volumeDivWidth)*100);
 	$("#volume-bar").css('width', progressPercentage+'%'); //Set volume bar width equal to this %

 	//If muted and volume is increased, then toggle mute button to unmute button
 	if(player.isMute === 1){
 		player.isMute=0;
 		$("#volume-btn").toggleClass("fa-volume-off fa-volume-up");
 	}

 	//If volume bar is below 2%, then mute
 	if(progressPercentage<2){
 		player.isMute=1;
 		$("#volume-btn").toggleClass("fa-volume-up fa-volume-off");
 		$(music)[0].volume= 0;
 	}
 	else{
	//Set volume equivalent to the %
	$(music)[0].volume= (progressPercentage/100);
	}

});

$("#volume-btn").click(function(event) {
let volume=$("#volume-btn");
if(player.isMute === 0){
	player.isMute=1;
	$(this).toggleClass("fa-volume-up fa-volume-off");
	$("#volume-bar").css('width', '0');
	$(music)[0].volume= 0;
}

else{
	player.isMute=0;
	$(this).toggleClass("fa-volume-off fa-volume-up");
	$("#volume-bar").css('width', '60%');
	$(music)[0].volume= 0.6;
}

});


//Play song
function playMusic()
{
	//If music is paused
	if(player.playing === false)
		{
		player.playing=true;
		
		clearActiveList();
		
		//get song id to reflect current song in playlist-item
		let currentSong=document.getElementById(`item-${player.musicIndex}`);
		currentSong.classList.add('active-song');

		music.play();

		//Start image and background animation
		docImage.classList.add('animate-image');
		
		//Toggle pause/play btn
		play.classList.replace('fa-play-circle','fa-pause-circle');
		}

	else {
		player.playing=false;
		music.pause();
		document.querySelector('.parent-container').classList.remove('animate-background');
		docImage.classList.remove('animate-image');
		
		play.classList.replace('fa-pause-circle','fa-play-circle');
		}
}



const songList= document.getElementsByClassName('playlist-item');

//Clicked playlist Item
$('.playlist').ready(function() {

$('.playlist-item').click(function(event) {
		
		clearActiveList();

		//Get music id eg item-n (n is index of music)
		let songID= $(this).attr('id');
		songID= songID.split("-");			//Split to get music index of current song
		songID=songID[1];
		player.musicIndex=songID;		

		$(this).addClass('active-song');
	
		setMusicIndex(player.musicIndex);		//Set music index to current index
	
		player.playing=false;
		playMusic();
	});

});	


//Clear Active class of all Playlist items
function clearActiveList(){
	$('.playlist-item').each(function() {
		$(this).removeClass('active-song');
	});
}


//Next Song
function nextMusic()
{
	player.musicIndex+=1;
	if(player.musicIndex > list_songs.length -1)
	{
		player.musicIndex=0;
	}
	setMusicIndex(player.musicIndex);

	player.playing=false;
	playMusic();
}


//Adding Events on Click
music.addEventListener('ended',nextMusic);

play.addEventListener("click",playMusic);
forward.addEventListener("click",nextMusic);


//Previous Song
backward.addEventListener("click",() =>{
	player.musicIndex-=1;

		if(player.musicIndex < 0)
		{
			player.musicIndex=list_songs.length-1;
		}

		setMusicIndex(player.musicIndex);

		player.playing=false;
		playMusic();

})


//Set music details for song to be played
function setMusicIndex(index){
	docTitle.innerText= list_songs[index].title;
	docArtist.innerText= list_songs[index].artist;
	docImage.src=`images/${list_songs[index].image}.jpg`;
	music.src=`music/${list_songs[index].title}.mp3`;
}



//Window Resize for toggle-menu
$(window).resize(function(){  
    
    /*If width> small-screen display playlist as inline-flex, else hide it*/
    if($(window).width() > 768)
    {
      $("#playlist").css({
		position: 'relative',
		display: 'inline-flex',
		height: '40rem',
		borderRadius:'1.5rem' });
	}

    else{
    	$("#playlist").css({
		display: 'none',
		position: 'fixed',
		top: '0',
		right: '0',
		height: '100%',
		borderRadius:'0%' });
    }
});


//Toggle-menu Clicked
$("#toggle-menu").click(function(event) {
	$("#playlist").fadeIn();
});


//Toogle menu close (X) button
$("#playlist-close").click(function(event) {
	$("#playlist").fadeOut();
});