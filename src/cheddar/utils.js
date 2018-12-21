function range(array, framerate) {
  let totalFrames = [];
  if (Array.isArray(array)) {
    totalFrames = [...Array(array[1] + 1).keys()].filter((n, i) => {
      return i > array[0] - 1 && i < array[1] + 1;
    });
  } else {
    totalFrames = [array];
  }
  return totalFrames;
}

function multiplyByFramerate(array, framerate) {
  frames = [];
  array.map(el => {
    [...Array(framerate).keys()].forEach(fr => {
      frames.push(el);
    });
  });
  return frames;
}

module.exports = { range, multiplyByFramerate };
