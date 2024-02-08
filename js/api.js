class VimeoApi {
  #accessToken = "036b61546a3d21ef6b67b5a946eec03c";

  async getVideoPicture() {
    const response = await fetch(
      "https://api.vimeo.com/videos/824804225/pictures",
      {
        headers: {
          Authorization: `Bearer ${this.#accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const { data } = await response.json();

    if (!data.length) {
      throw new Error(`Failed to fetch image: No data`);
    }

    return data[0].base_link;
  }
}
