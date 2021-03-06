"use strict";
var fs = require("fs");
var tf = require("../../bagua-tensorflow/src");

var DIGIT = process.argv[2] || "1";

var graphDef = fs.readFileSync("../../model-zoo/tf/mnist/keras-tf-mnist.pb");
var image = tf.io.loadImage("../images/" + DIGIT + ".png", 0);

var transformer = new tf.io.Transformer([28, 28, 1]); // HWC
transformer.setScale(1.0/255); // 0 ~ 255 => 0 ~ 1.0

//tf.io.namedWindow("Image");
//tf.io.show("Image", transformer.preprocess(image));
//tf.io.waitKey();

function maxIndex(probabilities) {
  var best = 0;
  for (var i = 1; i < probabilities.length; ++i) {
    if (probabilities[i] > probabilities[best]) {
      best = i;
    }
  }
  return best;
}

var g = new tf.Graph(graphDef);
var sess = new tf.Session(g);

sess.run(["Softmax"],
  {
    //keras_learning_phase: new tf.Tensor(false),
    convolution2d_input_1: new tf.Tensor(transformer.preprocess(image))
  },
  o => {
    let onehot = new Float32Array(o.data.buffer);
    console.log(maxIndex(onehot));
  }
);


