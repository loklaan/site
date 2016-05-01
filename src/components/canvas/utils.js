const zeroTo = (max) => Math.random() * max;

const randomSign = () => Math.random() > 0.5 ? -1 : 1;

const roofRange = (roof, range) => (Math.random() * range) + (roof - range);

const inRange = (min, max) => min + zeroTo(max - min);

const getCenter = (screenSize) => ({
  x: screenSize.x / 2,
  y: screenSize.y / 2
});

export default {
  zeroTo,
  randomSign,
  roofRange,
  inRange,
  getCenter
};
