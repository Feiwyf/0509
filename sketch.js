// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製手部關鍵點的圓
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 根據左右手設定顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255); // 左手：紫色
          } else {
            fill(255, 255, 0); // 右手：黃色
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // 繪製手部關鍵點之間的線條
        let ranges = [
          [0, 1, 2, 3, 4],   // 0 到 4
          [5, 6, 7, 8],      // 5 到 8
          [9, 10, 11, 12],   // 9 到 12
          [13, 14, 15, 16],  // 13 到 16
          [17, 18, 19, 20]   // 17 到 20
        ];

        for (let r of ranges) {
          for (let j = 0; j < r.length - 1; j++) {
            let start = hand.keypoints[r[j]];
            let end = hand.keypoints[r[j + 1]];
            stroke(hand.handedness == "Left" ? color(255, 0, 255) : color(255, 255, 0));
            strokeWeight(2);
            line(start.x, start.y, end.x, end.y);
          }
        }

        // 繪製隨食指移動的圓
        let indexFinger = hand.keypoints[8]; // 食指關鍵點
        fill(0, 255, 0, 150); // 半透明綠色
        noStroke();
        circle(indexFinger.x, indexFinger.y, 100); // 圓的直徑為 100
      }
    }
  }
}
