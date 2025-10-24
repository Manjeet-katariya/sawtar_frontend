// data.js
export const navItems = [
  { title: "Interiors", path: "/interiors" },
  {
    title: "Design Ideas",
    dropdown: [
      { title: "Living Room", path: "/design-ideas/living-room" },
      { title: "Bedroom", path: "/design-ideas/bedroom" },
    ],
  },
  {
    title: "Magazine",
    dropdown: [
      { title: "Home Trends", path: "/magazine/trends" },
      { title: "Inspiration", path: "/magazine/inspiration" },
    ],
  },
  {
    title: "Livspace TV",
    dropdown: [
      { title: "Episodes", path: "/tv/episodes" },
      { title: "Behind the Scenes", path: "/tv/bts" },
    ],
  },
  { title: "Cities", path: "/cities" },
  {
    title: "Store Locator",
    dropdown: [
      { title: "Find a Store", path: "/store-locator/find" },
      { title: "Book Visit", path: "/store-locator/book" },
    ],
  },
  {
    title: "More",
    dropdown: [
      { title: "About Us", path: "/about" },
      { title: "Careers", path: "/careers" },
    ],
  },
];
