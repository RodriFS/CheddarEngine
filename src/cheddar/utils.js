// this function creates an array of numbers from an array with two points
// for example, input is [1,4], output is [1,2,3,4]
// if instead of an array, the input is a number => input: 1, output: [1]
function range(array) {
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

// multiplies an array by a framerate
// input: [2,3,4,5], 2 => output: [2,2,3,3,4,4,5,5]
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
