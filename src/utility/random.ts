const getRandom = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export { getRandom, getRandomInt };
