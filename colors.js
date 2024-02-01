var colorsToMatch = [];
var colorDiff = [];
var scores = [];
var colorsHex = [];

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
function getRGBFromHex() {
  for (let i = 0; i < colorsHex.length; i++) {
    colorsToMatch[i] = hexToRgb(colorsHex[i]);
  }
}
var img;
var ctx;
var c;
function getCanvas() {
  c = document.querySelector("#myCanvas");
  var temp = document.querySelector("#myImage");
  img = temp.cloneNode();
  c.height = img.height;
  c.width = img.width;
  ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, img.width, img.height);
}
var final = [];
function changeColor() {
  final = [];
  var allColors = ["RGB(255,255,255)"];
  var data;
  for (let i = 0; i < img.height; i++) {
    final[i] = [];
    for (let j = 0; j < img.width; j++) {
      data = ctx.getImageData(j, i, 1, 1).data;
      var temp = `RGB(${data[0]},${data[1]},${data[2]})`;
      if (!allColors.includes(temp)) {
        allColors.push(temp);
      }
      if (data[3] <= 0) {
        final[i][j] = "0";
      } else {
        final[i][j] = allColors.indexOf(temp);
      }
    }
  }
  var temp = JSON.stringify(final);
  temp = temp.split("[").join("{").split("]").join("}");
  temp = temp.split('"').join("");
  temp =
    `[asy]
//made using https://chekinnooget.github.io/pixel-asy/
unitsize(0.2cm);

int[][] sprite = ` +
    temp +
    `;

pen[] colors = {${allColors.toString()}};

int height = sprite.length;
int length = sprite[0].length;

for (int i = 0; i < height; ++i)
{
for (int j = 0; j < length; ++j) {
fill(shift(j,i)*unitsquare,colors[sprite[height-i-1][j]]+miterjoin);
}
}

[/asy]`;
  document.querySelector(".textarea").value = temp;
  if (temp.length > 40000) {
    document.querySelector(".head").textContent =
      "warning: over 40k chars, exceeds aops post limit";
  } else {
    document.querySelector(".head").textContent = "copy and paste into aops";
  }
}

function colorButtonPressed() {
  //getVariables();
  hexToRgb();
  getRGBFromHex();
  getCanvas();
  changeColor();
}

function openImage() {
  const canvas = document.getElementById("myCanvas");
  canvas.toBlob((blob) => window.open(URL.createObjectURL(blob), "_blank"));
}
