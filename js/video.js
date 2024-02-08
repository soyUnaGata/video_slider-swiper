class Video {
  constructor({ id, vid, url, time, active, thumbmail }) {
    this.id = id;
    this.vid = vid;
    this.url = url;
    this.time = time;
    this.active = active;
    this.thumbmail = thumbmail ?? "";
  }
}
