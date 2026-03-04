import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';
import { chapter3 } from './chapter3';
import { chapter4 } from './chapter4';
import { chapter5 } from './chapter5';
import { chapter6 } from './chapter6';
import { chapter7 } from './chapter7';
import { chapter8 } from './chapter8';

export const bookData = {
  _id: "local-leading-from-within",
  title: "Leading from Within: Mastering Self to Impact Others",
  description: "A guide on how mastering self-leadership is the foundation for leading others and achieving success.",
  genre: "Leadership / Self-Development",
  price: 2000,
  status: "published",
  coverImage: "https://placehold.co/300x450/e9ecef/333333?text=Leading+from+Within",
  pages: [
    chapter1,
    chapter2,
    chapter3,
    chapter4,
    chapter5,
    chapter6,
    chapter7,
    chapter8
  ]
};

export {
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8
};
