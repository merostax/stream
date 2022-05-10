window.onload = function () {
    Particles.init({
        selector: ".background"
    });
};
Particles.init({
    selector: ".background",
    color: ["#03dac6", "#ff0266", "#000000"],
    connectParticles: true,
    responsive: [
        {
            breakpoint: 768,
            options: {
                color: ["#faebd7", "#03dac6", "#ff0266"],
                maxParticles: 43,
                connectParticles: false
            }
        }
    ]
});
class NavigationPage {
    constructor() {
        this.currentId = null;
        this.currentTab = null;
        this.tabContainerHeight = 70;
        this.lastScroll = 0;
        let self = this;
        $(".nav-tab").click(function () {
            self.onTabClick(event, $(this));
        });
        $(window).scroll(() => {
            this.onScroll();
        });
        $(window).resize(() => {
            this.onResize();
        });
    }

    onTabClick(event, element) {
        event.preventDefault();
        let scrollTop =
            $(element.attr("href")).offset().top - this.tabContainerHeight + 1;
        $("html, body").animate({ scrollTop: scrollTop }, 600);
    }

    onScroll() {
        this.checkHeaderPosition();
        this.findCurrentTabSelector();
        this.lastScroll = $(window).scrollTop();
    }

    onResize() {
        if (this.currentId) {
            this.setSliderCss();
        }
    }

    checkHeaderPosition() {
        const headerHeight = 75;
        if ($(window).scrollTop() > headerHeight) {
            $(".header").addClass("header--scrolled");
        } else {
            $(".header").removeClass("header--scrolled");
        }
        let offset =
            $(".nav").offset().top +
            $(".nav").height() -
            this.tabContainerHeight -
            headerHeight;
        if (
            $(window).scrollTop() > this.lastScroll &&
            $(window).scrollTop() > offset
        ) {
            $(".header").addClass("et-header--move-up");
            $(".nav-container").removeClass("nav-container--top-first");
            $(".nav-container").addClass("nav-container--top-second");
        } else if (
            $(window).scrollTop() < this.lastScroll &&
            $(window).scrollTop() > offset
        ) {
            $(".header").removeClass("et-header--move-up");
            $(".nav-container").removeClass("nav-container--top-second");
            $(".et-hero-tabs-container").addClass(
                "et-hero-tabs-container--top-first"
            );
        } else {
            $(".header").removeClass("header--move-up");
            $(".nav-container").removeClass("nav-container--top-first");
            $(".nav-container").removeClass("nav-container--top-second");
        }
    }

    findCurrentTabSelector(element) {
        let newCurrentId;
        let newCurrentTab;
        let self = this;
        $(".nav-tab").each(function () {
            let id = $(this).attr("href");
            let offsetTop = $(id).offset().top - self.tabContainerHeight;
            let offsetBottom =
                $(id).offset().top + $(id).height() - self.tabContainerHeight;
            if (
                $(window).scrollTop() > offsetTop &&
                $(window).scrollTop() < offsetBottom
            ) {
                newCurrentId = id;
                newCurrentTab = $(this);
            }
        });
        if (this.currentId !== newCurrentId || this.currentId === null) {
            this.currentId = newCurrentId;
            this.currentTab = newCurrentTab;
            this.setSliderCss();
        }
    }

    setSliderCss() {
        let width = 0;
        let left = 0;
        if (this.currentTab) {
            width = this.currentTab.css("width");
            left = this.currentTab.offset().left;
        }
        $(".nav-tab-slider").css("width", width);
        $(".nav-tab-slider").css("left", left);
    }
}

new NavigationPage();

let video = document.querySelector("#video");
let start_button = document.querySelector("#start-record");
let stop_button = document.querySelector("#stop-record");
let download_link = document.querySelector("#download-video");

let camera_stream = null;
let media_recorder = null;
let blobs_recorded = [];



start_button.addEventListener('click', async function () {
    // set MIME type of recording as video/webm
    camera_stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    video.srcObject = camera_stream;
    media_recorder = new MediaRecorder(camera_stream, {mimeType: 'video/webm'});

    // event : new recorded video blob available
    media_recorder.addEventListener('dataavailable', function (e) {
        blobs_recorded.push(e.data);
    });
    media_recorder.start(1000);
});
download_link.addEventListener('click', () => {
    const url = window.URL.createObjectURL(new Blob(blobs_recorded, {type: 'video/webm'}));
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.mp4';
    document.body.appendChild(a);
    a.click();
    var formdata = new FormData();
    formdata.append('blobFile', new Blob(blobs_recorded));


    fetch('uploader.php', {
        method: 'POST',
        body: formdata
    }).then(()=>{
        alert('its downloading ...')
    })

});
stop_button.addEventListener('click', function() {
    media_recorder.stop();
    video.pause();
});

let videoo= document.querySelector(".video-recording");
let startButton=document.querySelector('#start-recording');
let stopButton = document.querySelector('#stop-recording');
let downloadButton = document.querySelector('#download-videoo');

let streamm = null,
    audio = null,
    mixedStream= null,
    chunks = [],
    recorder = null

startButton.addEventListener('click',async function(){
    streamm = await navigator.mediaDevices.getDisplayMedia({
        video: true
    });
    audio = await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
        },
    });

    videoo.srcObject = streamm;
    videoo.play();
        mixedStream = new MediaStream([...streamm.getTracks(), ...audio.getTracks()]);
        recorder = new MediaRecorder(mixedStream);
        recorder.addEventListener('dataavailable', function (e) {
            chunks.push(e.data);});
        recorder.start(1000);

    });
stopButton.addEventListener('click', function() {
    streamm.getTracks().forEach((track) => track.stop());
    audio.getTracks().forEach((track) => track.stop());
});

downloadButton.addEventListener('click', () => {
    const url = window.URL.createObjectURL(new Blob(chunks, {type: 'video/webm'}));
    const aa = document.createElement('a');
    aa.style.display = 'none';
    aa.href = url;
    aa.download = 'test.mp4';
    document.body.appendChild(aa);
    aa.click();
    var formdata = new FormData();
    formdata.append('blobFile', new Blob(chunks));


    fetch('uploader.php', {
        method: 'POST',
        body: formdata
    }).then(()=>{
        alert('its downloading ...')
    })
});

let audioo= document.querySelector(".audio-recording");
let start=document.querySelector('#start-recordin');
let stop= document.querySelector('#stop-recordin');
let download= document.querySelector('#download-audio');

let audi = null,
    chunkss = [],
    mixed=null,
    recorderer = null

start.addEventListener('click',async function(){
    audi= await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
        },
    });
    audioo.srcObject=audi;
    audioo.play();
     mixed = new MediaStream([...audioo.getTracks()]);
    recorderer = new MediaRecorder(mixed);
    recorderer.addEventListener('dataavailable', function (e) {
        chunkss.push(e.data);});
    recorderer.start(1000);

});
stop.addEventListener('click', function() {
    audi.getTracks().forEach((track) => track.stop());
});

download.addEventListener('click', () => {
    const url = window.URL.createObjectURL(new Blob(chunkss, {type: 'video/webm'}));
    const aaa = document.createElement('a');
    aaa.style.display = 'none';
    aaa.href = url;
    aaa.download = 'test.mp4';
    document.body.appendChild(aaa);
    aaa.click();
    var formdata = new FormData();
    formdata.append('blobFile', new Blob(chunkss));
    fetch('uploader.php', {
        method: 'POST',
        body: formdata
    }).then(()=>{
        alert('its downloading ...')
    })
});
