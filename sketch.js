// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let circlePos = { x: 320, y: 240 }; // 圓的初始位置
let circleRadius = 50; // 圓的半徑

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

  // 繪製可拖曳的圓
  fill(0, 255, 0, 150); // 半透明綠色
  noStroke();
  circle(circlePos.x, circlePos.y, circleRadius * 2);

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

        // 檢查是否用食指和大拇指夾住圓
        let indexFinger = hand.keypoints[8]; // 食指關鍵點
        let thumb = hand.keypoints[4]; // 大拇指關鍵點

        let distance = dist(indexFinger.x, indexFinger.y, thumb.x, thumb.y);
        if (distance < circleRadius * 2) {
          if (!isDragging) {
            isDragging = true;
            dragOffset.x = circlePos.x - indexFinger.x;
            dragOffset.y = circlePos.y - indexFinger.y;
          }
        }

        // 如果正在拖曳，更新圓的位置
        if (isDragging) {
          circlePos.x = indexFinger.x + dragOffset.x;
          circlePos.y = indexFinger.y + dragOffset.y;
        }
      }
    }
  } else {
    isDragging = false; // 如果沒有檢測到手，停止拖曳
  }
}
