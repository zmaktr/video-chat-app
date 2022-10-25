// agora credentials
const APP_ID = "bbab7cc117bf44ffbcf7198f3b57e889";
const CHANNEL = "main";
const TOKEN =
  "007eJxTYJiYqcQ7oeunUL650Y5qtdQLCwo+JE3f6xEetm/uXP3uEmsFhqSkxCTz5GRDQ/OkNBOTtLSk5DRzQ0uLNOMkU/NUCwvLAsGI5LpARgYF47MsjAwQCOKzMOQmZuYxMAAADgEeQA==";
let UID;

// create a client object and specify channel profile (rtc) and codec (vp8)
const client = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" });

// store local audio and video tracks
let localTracks = [];
// store remote users audio and video tracks
let remoteUsers = {};

// video join, subscribe and leave

let joinAndDisplayLocalStream = async () => {
  // on method takes (eventName, listner) user-published event is comming from agora
  client.on("user-published", handleUserJoined);
  client.on("user-unpublished", handleUserLeft);

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

let handleUserJoined = async (user, mediaType) => {
  remoteUsers[user.uid] = user;
  // first user join() each subsequent user subscribes
  await client.subscribe(user, mediaType);

  if (mediaType === "video") {
    let player = document.getElementById(`user-container-${user.uid}`);
    if (player != null) {
      player.remove();
    }

    // create a new DOM element for new user and append it to DOM
    player = `<div class="video-container" id="user-container-${user.uid}">
    <div class="username-wrapper"><span class="user-name">My Name</span></div>
    <div class="video-player" id="user-${user.uid}"></div>
    </div>`;
    document
      .getElementById("video-streams")
      .insertAdjacentHTML("beforeend", player);

    user.videoTrack.play(`user-${user.uid}`);
  }
  if (mediaType === "audio") {
    user.audioTrack.play();
  }
};

let handleUserLeft = async (user) => {
  delete remoteUsers[user.uid];
  userElement = document.getElementById(`user-container-${user.uid}`);
  if (userElement != null) {
    console.log("user div removed");
    userElement.remove();
  }
};

joinAndDisplayLocalStream();

// Button controls

let leaveAndRemoveLocalStream = async () => {
  await client.leave();
  window.open("/", "_self");
};

let toggleCamera = async (e) => {
  if (localTracks[1].muted) {
    await localTracks[1].setMuted(false);
    e.target.style.backgroundColor = "#fff";
  } else {
    await localTracks[1].setMuted(true);
    e.target.style.backgroundColor = "red";
  }
};

document
  .getElementById("leave-btn")
  .addEventListener("click", leaveAndRemoveLocalStream);

document.getElementById("camera-btn").addEventListener("click", toggleCamera);
