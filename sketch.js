// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let circlePos = { x: 320, y: 240 }; // 圓的初始位置
let circleRadius = 50; // 圓的半徑
let trail = []; // 儲存圓心軌跡的陣列
let lineColor = [255, 0, 0]; // 初始顏色為紅色

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

  // 繪製圓心軌跡
  stroke(lineColor[0], lineColor[1], lineColor[2]); // 使用線條顏色
  strokeWeight(10); // 設定線條粗細為 10
  noFill();
  beginShape();
  for (let pos of trail) {
    vertex(pos.x, pos.y);
  }
  endShape();

  // 繪製可拖曳的圓
  fill(lineColor[0], lineColor[1], lineColor[2], 150); // 大圓顏色與線條顏色相同
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

          // 將圓心位置加入軌跡
          trail.push({ x: circlePos.x, y: circlePos.y });
        }
      }
    }
  } else {
    isDragging = false; // 如果沒有檢測到手，停止拖曳
  }

  // 當停止拖曳時，清空軌跡
  if (!isDragging) {
    trail = [];
  }
}
