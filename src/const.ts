interface ImageResource {
  resource: any;
  duration: number;
}

export type anis = 'cat' | 'dog'

export const animals = {
  'cat': 'cat',
  'dog': 'dog',
}

export const images: { [key: string]: ImageResource[] } = {
  'cat': [
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
  ],
  'dog': [
    {
      resource: require("../assets/dog_1.gif"),
      duration: 20
    },
    {
      resource: require("../assets/dog_2.gif"),
      duration: 20
    },
  ]
};

interface IndexRange {
  max: number;
  min: number;
}

export const showIndexRanges: { [key: string]: IndexRange } = {
  'cat': {
    max: 2,
    min: 0
  },
  'dog': {
    max: 1,
    min: 0
  },
};

