
/**
 * ASSET MANAGER
 * Prioritizes direct URLs if provided, otherwise falls back to picsum for demos.
 */

export const USE_LOCAL_FILES = false; 

const getPath = (src: string, demoKeyword: string, w = 1200, h = 800) => {
  // If it's already a full URL, return it
  if (src.startsWith('http')) return src;
  
  if (USE_LOCAL_FILES) return `./assets/${src}`;
  return `https://picsum.photos/${w}/${h}?random=${demoKeyword}`;
};

export const ASSETS = {
  videos: {
    heroBackground: "https://res.cloudinary.com/dpbblwdvl/video/upload/v1771185223/8500480-hd_1920_1080_30fps_rnoedf.mp4",
    heroFallback: "https://assets.mixkit.co/videos/preview/mixkit-children-playing-in-a-park-on-a-sunny-day-31562-large.mp4"
  },

  branding: {
    logo: getPath("https://res.cloudinary.com/dpbblwdvl/image/upload/v1771185225/Logo_n5bl0w.png", "school-logo", 300, 300),
    principal: getPath("images/branding/principal.jpg", "principal", 600, 600),
    prin: getPath("https://res.cloudinary.com/dpbblwdvl/image/upload/v1771185226/590657035_122099933589140528_7853115112328779870_n_n6fbli.jpg", "prin", 600, 600),
  },

  sections: {
    heroKids: getPath("images/sections/hero-kids.png", "happy-children", 1000, 1000),
    schoolBuilding: getPath("images/sections/school.jpg", "school-building", 1600, 900),
    classroom: getPath("images/sections/class.jpg", "classroom", 800, 600),
    playground: getPath("images/sections/play.jpg", "playground", 800, 600),
    event: getPath("images/sections/event.jpg", "school-event", 800, 600),
  },

  gallery: [
    getPath("https://i.ibb.co/G6gBtZN/590657035-122099933589140528-7853115112328779870_n.jpg", "fun1"),
    getPath("images/gallery/2.jpg", "fun2"),
    getPath("images/gallery/3.jpg", "fun3"),
    getPath("images/gallery/4.jpg", "fun4"),
    getPath("images/gallery/5.jpg", "fun5"),
    getPath("images/gallery/6.jpg", "fun6"),
  ],

  galleryVideos: [
    "https://assets.mixkit.co/videos/preview/mixkit-children-running-through-a-sunny-park-42643-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-children-laughing-and-playing-outdoors-34533-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-preschool-children-playing-together-in-classroom-34447-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-kids-playing-with-colorful-blocks-34537-large.mp4"
  ]
};
