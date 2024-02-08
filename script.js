const imageContainer = document.querySelectorAll(".slide-img");
const closeBtn = document.querySelector("#closePopup");
const popup = document.querySelector("#popup");
const popuVideo = document.querySelector(".popup-content__video");
const pagination = document.querySelectorAll(".pagination-dot");
const playerIframe = document.querySelector(".popup-video__player");
let vimeoPlayer = null;
const accessToken = "036b61546a3d21ef6b67b5a946eec03c";

const videos = [
  {
    id: 1,
    vid: 524933864,
    url: "https://player.vimeo.com/video/524933864",
    time: 0,
    active: false,
  },
  {
    id: 2,
    vid: 516640630,
    url: "https://player.vimeo.com/video/516640630",
    time: 0,
    active: false,
  },
  {
    id: 3,
    vid: 824804225,
    url: "https://player.vimeo.com/video/824804225",
    time: 0,
    active: false,
  },
  {
    id: 4,
    vid: 824804225,
    url: "https://player.vimeo.com/video/824804225",
    time: 0,
    active: false,
  },
  {
    id: 5,
    vid: 824804225,
    url: "https://player.vimeo.com/video/824804225",
    time: 0,
    active: false,
  },
  {
    id: 6,
    vid: 824804225,
    url: "https://player.vimeo.com/video/824804225",
    time: 0,
    active: false,
  },
  {
    id: 7,
    vid: 824804225,
    url: "https://player.vimeo.com/video/824804225",
    time: 0,
    active: false,
  },
  {
    id: 8,
    vid: 824804225,
    url: "https://player.vimeo.com/video/824804225",
    time: 0,
    active: false,
  },
];

const swiper = new Swiper(".mySwiper", {
  slidesPerView: 4,
  spaceBetween: 30,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

async function getImage() {
  const response = await fetch(
    "https://api.vimeo.com/videos/824804225/pictures",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch image:", response.statusText);
    return;
  }

  const responseData = await response.json();

  const imageUrl = responseData.data[0].base_link;

  imageContainer.forEach((container, index) => {
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.classList.add("slider__img");
    container.appendChild(imgElement);

    imgElement.addEventListener("click", () => openPopupVideo(index));
  });
}

getImage();

const getPaginationBtn = (index) =>
  document.querySelector(`.pagination .pagination-dot:nth-child(${index + 1})`);

const resetRecentState = async () => {
  const recentIndex = videos.findIndex((v) => v.active);

  if (recentIndex === -1) return;

  getPaginationBtn(recentIndex)?.classList.remove("active");
  await vimeoPlayer.unload();
};

const captureRecentVideoTime = async () => {
  const video = videos.find((v) => v.active);

  if (!video) return;

  video.time = await vimeoPlayer.getCurrentTime();
};

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
    console.log(vimeoPlayer);
    await vimeoPlayer.loadVideo(video.vid);
    await vimeoPlayer.play();
    await vimeoPlayer.setCurrentTime(video.time);
    console.log(await vimeoPlayer.getCurrentTime());
  }

  popup.style.display = "flex";
}

closeBtn.addEventListener("click", closePopup);

async function closePopup() {
  await captureRecentVideoTime();
  await resetRecentState();
  popup.style.display = "none";
}

pagination.forEach((button, index) => {
  button.addEventListener("click", () => {
    pagination.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    openPopupVideo(index);
  });
});
