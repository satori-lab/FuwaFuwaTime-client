interface ImageResource {
  resource: any;
  duration: number;
}

export const catImages: ImageResource[] = [
  {
    resource: require("../assets/cat_1.gif"),
    duration: 15
  },
  {
    resource: require("../assets/cat_2.gif"),
    duration: 20
  },
  {
    resource: require("../assets/cat_3.gif"),
    duration: 20
  }
];

interface IndexRange {
  max: number;
  min: number;
}

export const catShowIndexRange = {
  max: 2,
  min: 0
}
