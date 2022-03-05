$(document).ready(() => {
    class Video {
        constructor(url, id, title, index) {
            this.url = url;
            this.id = id;
            this.title = title;
            this.index = index;
            this.embedURL = "https://www.youtube.com/embed/" + this.id; 
        }
    }
    
    const videoSubmitButton = document.getElementById("video-submit-button");
    const videoInput = document.getElementById("video-input");
    const videosContainer = document.getElementById("videos-container");
    const currentVideoElement = document.getElementById("current-video");
    const currentVideoTitle = document.getElementById("current-video-title");
    const controlBar = document.getElementById("control-bar");
    const previousVideoButton = document.getElementById("prev-video-button");
    const nextVideoButton = document.getElementById("next-video-button");
    const playlistVideos = document.getElementById("playlist-videos");
    
    let videos = [];
    let apiKey = "MY_API_KEY";
    let currentVideoIndex = -1;
    
    function extractID(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
    
        if (match && match[2].length == 11) {
            id = match[2];
            embedSrc = "https://www.youtube.com/embed/" + this.id;
        }
    
        return id;
    }
    
    function addVideo(event) {
        event.preventDefault();
    
        if (videoInput.value != "") {
            let videoURL = videoInput.value;
            let videoID = extractID(videoURL);
            let requestURL = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoID + "&key=" + apiKey;
    
            fetch(requestURL)
            .then((response) => response.json())
            .then(json => {
                console.log(json);
                let title = json.items[0].snippet.title;
                let channelTitle = json.items[0].snippet.channelTitle;
                let index = videos.length > 0 ? (videos.length - 1) : 0;
                let thumbnailImgSrc = json.items[0].snippet.thumbnails.maxres.url;
    
                const newVideo = document.createElement("div");
                newVideo.classList.add("playlist-video");
                
                const thumbnailImg = document.createElement("img");
                thumbnailImg.setAttribute("src", thumbnailImgSrc);
                thumbnailImg.classList.add("thumbnail");
                newVideo.appendChild(thumbnailImg);
    
                const newVideoDescription = document.createElement("div");
                newVideoDescription.classList.add("description-container");
                
                const descriptionTitle = document.createElement("h3");
                descriptionTitle.innerText = title;
                
                const descriptionChannelTitle = document.createElement("p");
                descriptionChannelTitle.innerText = channelTitle;
    
                newVideoDescription.appendChild(descriptionTitle);
                newVideoDescription.appendChild(descriptionChannelTitle);
    
                newVideo.appendChild(newVideoDescription);
                playlistVideos.appendChild(newVideo);
    
                console.log(json);
    
                //const newVideo = document.createElement("div");
                //newVideo.classList.add("video");
                //const newVideoTitle = document.createElement("h3");
                //newVideoTitle.classList.add("video-title");
    
                const newVideoObject = new Video(videoURL, videoID, title, index);
                videos.push(newVideoObject);
    
                //newVideoTitle.innerText = videos[videos.length - 1].title;
    
                //const deleteButton = document.createElement("button");
                //deleteButton.classList.add('delete-button');
                //deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    
                //const editButton = document.createElement("button");
                //editButton.classList.add('edit-button');
                //editButton.innerHTML = '<i class="fas fa-edit"></i>';
                
    
                videoInput.value = "";
    
                if (videos.length === 1) {
                    placeholderVideo.setAttribute("style", "display: none;");
    
                    currentVideoElement.setAttribute("style", "display: inline;");
                    currentVideoElement.setAttribute("src", videos[0].embedURL);
                    controlBar.setAttribute("style", "display: flex;");
                    currentVideoIndex = 0;
                }
            })
            .catch((error) => {
                console.log(error);
            });
            
        }
    
        console.log(videos);
    }
    
    function deleteVideo(event) {
        if (event.target.classList[0] === "delete-button") {
            const video = event.target.parentElement;
            video.remove();
    
            for (let i = 0; i < videos.length; i++) {
                if (event.target.parentElement.children[0].innerText === videos[i].title) {
                    videos.splice(i, 1)
                }
            }
    
            if (videos.length == 0) {
                placeholderVideo.setAttribute("style", "display: flex;");
                currentVideoElement.setAttribute("style", "display: none;");
                currentVideoElement.setAttribute("src", "");
    
            }
        }
    
        console.log(videos);
    }
    
    function displayNextVideo() {
        if (videos.length > 1) {
            currentVideoIndex = ++currentVideoIndex % videos.length;
            currentVideoElement.setAttribute("src", videos[currentVideoIndex].embedURL);
        }
    }
    
    function displayPreviousVideo() {
        if (videos.length > 1) {
            if (currentVideoIndex == 0) {
                currentVideoIndex = videos.length - 1;
            }
            else {
                --currentVideoIndex;
            }
    
            currentVideoElement.setAttribute("src", videos[currentVideoIndex].embedURL);
        }
    }
    
    
    videoSubmitButton.addEventListener("click", addVideo);
    videoInput.addEventListener("keyup", event => {
        if (event.key === "Enter") {
            addVideo(event);
            console.log(event);
        }
    });
    //videosContainer.addEventListener("click", deleteVideo);
    previousVideoButton.addEventListener("click", displayPreviousVideo);
    nextVideoButton.addEventListener("click", displayNextVideo);
})
