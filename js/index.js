const swiperWrapper = document.querySelector(".swiper-wrapper");
const closeBtn = document.querySelector("#closePopup");
const popup = document.querySelector("#popup");
const popuVideo = document.querySelector(".popup-content__video");
const pagination = document.querySelectorAll(".pagination-dot");
const playerIframe = document.querySelector(".popup-video__player");
let vimeoPlayer = null;

const vimeoApi = new VimeoApi();
const videos = mockVideos.map((v) => new Video(v));

async function init() {
  let html = "";
  for (let video of videos) {
    video.thumbnail = await vimeoApi.getVideoPicture();
    html += `<div class="swiper-slide slide-img"><img class="slider__img" src="${video.thumbnail}" / ></div>`;
  }

  swiperWrapper.innerHTML += html;
  swiperWrapper
    .querySelectorAll(".slide-img")
    .forEach((el, inx) =>
      el.addEventListener("click", () => openPopupVideo(inx))
    );

  new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  closeBtn.addEventListener("click", closePopup);

  pagination.forEach((el, inx) => {
    el.addEventListener("click", () => openPopupVideo(inx));
  });
}

const getPaginationBtn = (index) =>
  document.querySelector(`.pagination .pagination-dot:nth-child(${index + 1})`);

const resetRecentState = async () => {
  const recentIndex = videos.findIndex((v) => v.active);
  console.log(recentIndex);

  if (recentIndex === -1) return;

  videos[recentIndex].active = false;
  getPaginationBtn(recentIndex)?.classList.remove("active");
  await vimeoPlayer.unload();
};

const captureRecentVideoTime = async () => {
  const video = videos.find((v) => v.active);

  if (!video) return;

  video.time = await vimeoPlayer.getCurrentTime();
};

async function closePopup() {
  await captureRecentVideoTime();
  await resetRecentState();
  popup.style.display = "none";
}

async function openPopupVideo(index) {
  await captureRecentVideoTime();
  await resetRecentState();
  const video = videos[index];
  video.active = true;

  console.log(videos);
  getPaginationBtn(index)?.classList.add("active");

  if (!vimeoPlayer) {
    playerIframe.src = `${video.url}?t=${video.time}&muted=1`;
    vimeoPlayer = new Vimeo.Player(playerIframe);
    await vimeoPlayer.play();
  } else {
    await vimeoPlayer.loadVideo(video.vid);
    await vimeoPlayer.play();
    await vimeoPlayer.setCurrentTime(video.time);
  }

  popup.style.display = "flex";
}

init();
