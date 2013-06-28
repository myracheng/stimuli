var strokeWidth = 2;
var strokeColor = "#000000";

width = 250;
height = 270;

var color = new RColor;

myRnd = function(mean, range) {
  if (mean + range < 1) {
    upper = mean + range;
  } else {
    upper = 1;
  }
  if (mean - range > .1) {
    lower = mean - range;
  } else {
    lower = .1;
  }
  interval = upper - lower;
  return Math.random() * interval + lower;
}

function myDrawPath(pathString) {
  myPath = paper.path(pathString);
  myPath.attr("stroke", strokeColor);
  myPath.attr("stroke-width", strokeWidth); 
}

function myColor(meanColor) {
  c = Raphael.color(meanColor);
  hue = myRnd(c.h, 0.05);
  saturation = myRnd(c.s, 0.5);
  value = myRnd(c.v, 0.4);
  newColor = Raphael.hsb2rgb(hue, saturation, value);
  return newColor.hex;
}

function lighten(origColor) {
  c = Raphael.color(origColor);
  hue = myRnd(c.h, 0.05);
  if (c.s - 0.5 > 0) {
    saturation = c.s - 0.5;
  } else {
    saturation = 0;
  }
  if (c.v + 0.5 < 1) {
    value = c.v + 0.5;
  } else {
    value = 1;
  }
  newColor = Raphael.hsb2rgb(c.h, saturation, value);
  return newColor.hex;
}

function Tree() {
  this.draw = draw;
  var baseBerryColor = color.get(true, .5, .99);
  var baseTrunkColor = color.get(true, .5, .8);
  var baseLeafColor = color.get(true, .5, .99);
  var baseWidth = Math.random();
  var baseHeight = Math.random();
  this.baseBerryColor = baseBerryColor;
  this.baseLeafColor = baseLeafColor;
  this.baseTrunkColor = baseTrunkColor;
  this.baseWidth = baseWidth;
  this.baseHeight = baseHeight;

  //-----------HEIGHT AND WIDTH OF TREE----------//
  //for x values, distance from 101.5 should multiply by 1+ uniform(0,1)
  //for y values, ......
  var locs = {"bottom left": 0, "small lower": 3, "lower left": 9,
              "upper left": 15, "upper right": 24, "lower right": 30,
              "bottom right": 36};
  var origTrunkX = [96, 101, 105, 109, 113, 114, 113, 112, 110, 107, 110, 114,
                    113, 114, 114, 114, 114, 114, 116, 121, 124, 125, 126, 128,
                    127, 125, 123, 123, 124, 131, 131, 128, 126, 133, 136, 141,
                    147, 130, 113, 96];
  var origTrunkY = [1, 10, 20, 30, 44, 59, 73, 79, 85, 90, 85, 93, 97,
                    100, 107, 109, 103, 97, 92, 90, 95, 98, 99, 106,
                    101, 92, 84, 75, 70, 75, 74, 56, 36, 18, 11, 5, 1,
                    1, 1, 1].map(function(y) {return height - y;});
  var xCenter = (origTrunkX[locs["bottom left"]] +
                 origTrunkX[locs["bottom right"]])/2;

  //-----------TRUNK--------------//
  function drawTrunk(paper, trunkX, trunkY) {
    var trunkColor = myColor(baseTrunkColor);
    var trunkGradient = "0-#fff-"+trunkColor;
    trunkPath = "M " + trunkX[0] + "," + trunkY[0] + " C";
    for (i=1; i < trunkX.length; i++) {
      trunkPath += (" " + trunkX[i] + "," + trunkY[i]);
    }
    trunkPath += " z";
    trunk = paper.path(trunkPath);
    trunk.attr("fill", trunkGradient);
    trunk.attr("stroke-width", strokeWidth);
    return trunkColor;
  }

  //-----------BRANCHES-----------//
  function drawBranches(paper, trunkX, trunkY) {
    branchPathStrings = [
                         "M " + trunkX[locs["small lower"]] + "," + 
                         trunkY[locs["small lower"]] + " c 0,-3 0,-6 -1,-9 " +
                         "-1,-5 -4,-9 -8,-12 -4,-2 -9,-2 -12,1 -3,2 -4,7 " +
                         "-2,10 1,3 4,4 7,3 3,-1 5,-5 3,-7 -1,-2 -3,-2 -5,-1" +
                         " -1,1 -1,3 1,4 1,1 2,-3 0,-2", //small lower branch

                         "M "+trunkX[locs["lower left"]] + "," +
                         trunkY[locs["lower left"]] + " c -9,-12 -32,-13 " +
                         "-44,-6 -4,3 -11,0 -16,-2 -3,-2 -6,-5 -7,-9 0,-4 " +
                         "2,-8 6,-9 2,-1 5,0 7,2 2,2 2,6 0,8 -1,2 -4,2 -6,0" +
                         " -1,-1 -1,-4 0,-5 1,-1 3,0 3,1 1,1 " + 
                         "-2,2 -1,1", //upper tendril off of lower left branch

                         "M " + trunkX[locs["lower left"]] + "," +
                         trunkY[locs["lower left"]] + " c -11,-12 -27,-14 " +
                         "-40,-8 -5,2 -10,6 -13,11 -7,11 -9,24 -8,37 1,9 " +
                         "8,17 17,17 8,0 16,-7 16,-15 1,-7 -5,-15 -13,-15 " +
                         "-7,0 -12,6 -11,13 1,5 6,9 11,8 4,-1 7,-7 4,-11 " +
                         "-2,-4 -9,-2 -8,2 " +
                         "0,3 6,3 4,0", //main part of lower left branch

                         "M " + trunkX[locs["lower left"]] + "," +
                         trunkY[locs["lower left"]]+" c -3,-3 -6,-7 -10,-8 " +
                         "-8,-3 -17,0 -22,6 -4,6 -5,15 0,21 3,3 8,5 12,4 " +
                         "4,-1 7,-6 6,-10 0,-3 -3,-6 -6,-5 -2,0 -4,3 -3,5 " +
                         "0,1 3,2 3,0", //lower tendril off of lower left branch

                         "M " + trunkX[locs["upper left"]] + "," +
                         trunkY[locs["upper left"]]+" c 0,-2 -1,-5 -2,-7 " +
                         "-4,-8 -10,-15 -18,-17 -6,-2 -13,-1 -18,2 -4,2 -8,7" +
                         " -8,12 0,5 5,10 10,9 4,0 8,-5 7,-9 0,-4 -5,-7 " +
                         "-9,-5 -3,1 -4,5 -2,8 2,2 5,2 6,-1 1,-2 -1,-4 -3,-4" +
                         " -2,0 -2,4 0,3", //tendril #1 of upper left branch

                         "M " + trunkX[locs["upper left"]] + "," +
                         trunkY[locs["upper left"]] + " c 1,-12 -2,-24 " +
                         "-10,-33 -9,-9 -23,-12 -35,-9 -5,1 -10,4 -15,7 -3,4" +
                         " -4,10 0,14 5,5 15,3 18,-4 1,-3 -1,-7 -5,-8 -3,0 " +
                         "-7,2 -6,6 0,4 7,2 5,-1 0,-1 " +
                         "-3,0 -1,1", //tendril #2 of upper left branch

                         "M " + trunkX[locs["upper left"]] + "," +
                         trunkY[locs["upper left"]] + " c 2,-24 -15,-45 " +
                         "-10,-53 1,-2 4,-3 8,-3 4,0 7,5 6,9 -1,3 -4,5 -7,4" +
                         " -2,-1 -4,-3 -3,-5 0,-2 2,-3 4,-2 1,0 2,2 1,3 0,1" +
                         " -1,1 -2,1 0,0 -1,-1 0,-1 " +
                         "0,0 0,0 1,0", //tendril #3 of upper left branch

                         "M " + trunkX[locs["upper left"]] + "," +
                         trunkY[locs["upper left"]] + " c -1,-15 1,-35 13,-44" +
                         " 4,-3 11,-6 17,-5 8,2 15,8 13,17 -1,7 -8,12 " +
                         "-15,11 -5,-1 -9,-6 -8,-11 1,-4 5,-7 9,-6 3,1 5,3 " +
                         "4,6 -1,2 -2,3 -4,3 -1,0 -2,-2 -1,-3 0,-1 " +
                         "1,-1 2,-1", //tendril #4 of upper left branch

                         "M " + trunkX[locs["upper right"]] + "," +
                         trunkY[locs["upper right"]] + " c 5,-8 13,-16 " +
                         "23,-19 17,-6 37,2 44,18 4,8 3,19 -2,26 -3,5 -10,7" +
                         " -16,4 -6,-2 -11,-9 -9,-15 1,-5 8,-9 13,-6 4,2 " +
                         "7,8 3,11 -3,3 -8,1 -8,-3 -1,-4 " +
                         "6,-3 4,0", //upper tendril of upper right branch

                         "M " + trunkX[locs["upper right"]] + "," +
                         trunkY[locs["upper right"]] + " c 2,-5 6,-8 10,-11 " +
                         "6,-4 12,-8 20,-10 2,0 4,1 6,1 6,1 11,5 13,10 1,4 " +
                         "0,10 -4,12 -3,2 -8,0 -9,-3 -1,-3 0,-7 3,-8 3,-1 " +
                         "5,2 4,4 0,2 -5,2 -4,0 " +
                         "0,-1 2,-1 1,0", //lower tendril of upper right branch

                         "M " + trunkX[locs["lower right"]] + "," +
                         trunkY[locs["lower right"]]+" c 22,-19 40,-3 40,20" +
                         " -2,11 -11,20 -22,18 -8,-1 -15,-10 -13,-19 1,-7 " +
                         "8,-13 14,-11 5,1 9,6 8,12 -1,4 -5,7 -8,6 -2,-1 " +
                         "-4,-3 -3,-6 1,-1 2,-3 4,-2" //lower right branch
                        ];
    branchPathStrings.map(myDrawPath);
  }

  //------------LEAVES------------//
  function drawLeaves(paper, trunkX, trunkY) {
    /*xposition and yposition of where stem attaches to tree, direction leaves
    curve toward: either clockwise or counterclockwise, and then what branch the
    berry is on, and then the angle of rotation.*/
    leafYs = [152, 148, 154, 158, 152, 116, 106, 96, 98, 75, 65, 82, 65].map(function(x) {return height - x;});
    var leafPositions = [ [75, leafYs[0], "clock", "upper left", -20],
                          [95, leafYs[1], "clock", "upper left", 0],
                          [128, leafYs[2], "counter", "upper left", 0],
                          [145, leafYs[3], "counter", "upper left", 10],
                          [155, leafYs[4], "counter", "upper left", 60],
                          [180, leafYs[5], "counter", "upper right", 0],
                          [192, leafYs[6], "counter", "upper right", 25],
                          [195, leafYs[7], "counter", "upper right", 60],
                          [97, leafYs[8], "clock", "lower left", 20],
                          [49, leafYs[9], "clock", "lower left", -40],
                          [46, leafYs[10], "clock", "lower left", -100],
                          [145, leafYs[11], "counter", "lower right", -5],
                          [170, leafYs[12], "counter", "lower right", 80] ];
    var leafColor = myColor(baseLeafColor);
    function drawLeaf(pos) {
      direction = pos[2];
      branch = pos[3];
      angle = pos[4];
      index = locs[branch];
      changeX = trunkX[index] - origTrunkX[index];
      changeY = trunkY[index] - origTrunkY[index];
      xpos = pos[0] + changeX;
      ypos = pos[1] + changeY;
      if (direction == "clock") {
        stemPath = "M " + xpos.toString() + "," + ypos.toString() +
                   "c -4.66532,-5.31951 -8.13198,-12.67083 -8.09411,-19.20008";
        leafPath = "M " + (xpos - 9).toString() + "," + (ypos-29).toString() +
                   " c 7.88487,4.26057 10.52989,11.20663 10.52989,11.20663 0.32771,12.87926 -8.71699,17.94538 -15.71952,8.05647 -0.86462,-4.4842 0.51588,-14.34595 5.18963,-19.2631 z";
      } else {
        stemPath = "M " + xpos.toString() + "," + ypos.toString() +
                   "c 4.46508,-4.3145 8.59388,-12.94298 8.52128,-19.01436";
        leafPath = "M " + (xpos+10).toString() + "," + (ypos-29).toString() +
                   " c -7.97815,4.08324 -10.77777,10.96844 -10.77777,10.96844 0.44351,4.6407 0.50774,7.66519 4.207,11.9888 3.95476,2.09474 8.30737,0.62026 11.3285,-3.58295 0.96464,-4.46375 -0.19507,-14.3539 -4.75773,-19.37429 z";
      }
      var leaf = paper.path(leafPath);
      leaf.attr("fill", leafColor);
      leaf.attr("stroke", strokeColor);
      leaf.attr("stroke-width", strokeWidth);
      leaf.rotate(angle, xpos, ypos);

      var stem = paper.path(stemPath);
      stem.attr("stroke", strokeColor);
      stem.attr("stroke-width", strokeWidth);
      stem.rotate(angle, xpos, ypos);
      //stem.transorm("r" + angle.toString + "," + xpos.toString() + "," +
      //              ypos.toString());
    }
    leafPositions.map(drawLeaf);
    return leafColor;
  }

  //------------BERRIES------------//
  function drawBerries(paper, trunkX, trunkY) {
    /*xposition and yposition of upper left-hand corner, direction berries "fall":
    either out to the left or out to the right, and then what branch the berry
    is on.*/
    berriesYs = [140, 153, 166, 136, 149, 119, 101, 83, 83, 55, 57].map(function(x) {return height - x;});
    var berryPositions = [ [51, berriesYs[0], "left", "upper left"],
                           [83, berriesYs[1], "left", "upper left"],
                           [115, berriesYs[2], "right", "upper left"],
                           [116, berriesYs[3], "right", "upper left"],
                           [157, berriesYs[4], "right", "upper left"],
                           [182, berriesYs[5], "right", "upper right"],
                           [70, berriesYs[6], "left", "lower left"],
                           [90, berriesYs[7], "right", "lower left"],
                           [143, berriesYs[8], "right", "lower right"],
                           [54, berriesYs[9], "left", "lower left"],
                           [172, berriesYs[10], "right", "lower right"] ];
    var berryColor = myColor(baseBerryColor);
    function drawBerryClumps(positions) {
      var berryRadius = 4.5;
      /* drawBerryClump takes in the position where the stem connects to the
      branch and draws two joined berries there */
      function drawBerryClump(pos) {
        // drawBerry draws one berry as a circle with center at x,y
        function drawBerry(p) {
          var berry = paper.circle(p[0], p[1], berryRadius);
          berry.attr("fill", berryColor);
          berry.attr("stroke", strokeColor);
          berry.attr("stroke-width", strokeWidth);   
        }
        branch = pos[3];
        index = locs[branch];
        changeX = trunkX[index] - origTrunkX[index];
        changeY = trunkY[index] - origTrunkY[index];
        xpos = pos[0] + changeX;
        ypos = pos[1] + changeY;
        direction = pos[2];
        if (direction == "right") {
          rightBerryPos = [xpos+13, ypos+14];
          leftBerryPos = [xpos+1, ypos+19];
          stemXPos = (xpos+12).toString();
          stemYPos = (ypos+10).toString();
          var stem = paper.path("M" + stemXPos + " " + stemYPos +
                                "c -0.3 -7 -6 -7 -11 -8, 2 4 4 8 -1 13");
        } else {
          rightBerryPos = [xpos-13, ypos+14];
          leftBerryPos = [xpos-1, ypos+19];
          stemXPos = (xpos-12).toString();
          stemYPos = (ypos+10).toString();
          var stem = paper.path("M" + stemXPos + " " + stemYPos +
                                "c 0.3 -7 6 -7 11 -8, -2 4 -4 8 1 13");
        }
        stem.attr("stroke", strokeColor);
        stem.attr("stroke-width", strokeWidth); 
        drawBerry(rightBerryPos);
        drawBerry(leftBerryPos);
      }
      positions.map(drawBerryClump);
    }
    drawBerryClumps(berryPositions);
    return berryColor;
  }

  //-------DRAW TREE------//
  function draw(label, berries, leaves) {
    var w = myRnd(baseWidth, 0.4);
    var h = myRnd(baseHeight, 0.4);
    var widthFactor = w * 1.5 + 0.7;
    var heightFactor = h + 0.7;
    trunkX = origTrunkX.map(randWidth);
    trunkY = origTrunkY.map(randHeight);
    function randWidth(x) {
      return (xCenter + (x-xCenter)*widthFactor).toString();
    }
    function randHeight(y) {
      lowest = origTrunkY[locs["bottom left"]];
      return lowest + heightFactor * (y - lowest);
    }

    paper = Raphael(label, width, height);
    trunkColor = drawTrunk(paper, trunkX, trunkY);
    drawBranches(paper, trunkX, trunkY);
    if (leaves) {
      leafColor = drawLeaves(paper, trunkX, trunkY)
    } else {
      leafColor = null;
    };
    if (berries) {
      berryColor = drawBerries(paper, trunkX, trunkY)
    } else {
      berryColor = null;
    };
    return {
      berryColor: berryColor,
      leafColor: leafColor,
      trunkColor: trunkColor,
      width: w,
      height: h,
      label: label,
      berries: berries,
      leaves: leaves
    };
  }
}
