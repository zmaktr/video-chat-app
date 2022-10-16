// agora credentials
const APP_ID = "bbab7cc117bf44ffbcf7198f3b57e889";
const CHANNEL = "main";
const TOKEN =
  "007eJxTYLBW/zhlFs+RvUe2yd5i9Z+14u2j1QzCNUxbY/etnF6Xu7pWgSEpKTHJPDnZ0NA8Kc3EJC0tKTnN3NDSIs04ydQ81cLCcqq6T3JdICNDovETRkYGCATxWRhyEzPzGBgAnvUgRw==";
let UID;

// create a client object and specify channel profile (rtc) and codec (vp8)
const client = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" });

// store local audio and video tracks
let localTracks = [];
// store remote users audio and video tracks
let remoteUsers = {};

let joinAndDisplayLocalStream = async () => {
  // client object joins a channel with credentials and UID
  UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

  // creates an audio track and a video track with authorization
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

  // create a new DOM element and append it to DOM
  let player = `<div class="video-container" id="user-container-${UID}">
  <div class="username-wrapper"><span class="user-name">My Name</span></div>
  <div class="video-player" id="user-${UID}"></div>
  </div>`;
  document
    .getElementById("video-streams")
    .insertAdjacentHTML("beforeend", player);

  // access the video track [1] not audio [0] and play the video inside the DOM by getting elements by id user-UID
  localTracks[1].play(`user-${UID}`);

  // Publishes local audio and/or video tracks to a channel
  await client.publish([localTracks[0], localTracks[1]]);
};

joinAndDisplayLocalStream();
