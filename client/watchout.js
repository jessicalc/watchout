// start slingin' some d3 here.

var gameOptions = {
  height: 600,
  width: 800,
  enemies: 1,
  padding: 20,
  enemyRadius: 10
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3
  .select('.gameboard')
  .append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

var updateScore = function() {
  d3.select(".current").text("Current score: " + gameStats.score.toString());
};

var updateCollisionCount = function() {
  d3.select(".collisions").text("Collisions: " + gameStats.collisions.toString());
};

var updateBestScore = function() {
  gameStats.bestScore = _.max(gameStats.bestScore, gameStats.score);
  d3.select(".high").test(gameStats.bestScore.toString());
};

var createEnemies = function() {
  return _.range(0, gameOptions.enemies).map(function(i) {
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }
  });
};

var Player = function() {
  this.r  = 10;
  this.color = "red";
};

var drag = d3.behavior.drag()
    .on("drag", dragmove);

function dragmove(d) {
  d3.select(this)
      .attr("cx", d.x = Math.max(20, Math.min(gameOptions.width - 20, d3.event.x)))
      .attr("cy", d.y = Math.max(20, Math.min(gameOptions.height - 20, d3.event.y)));
}

var newPlayer = [new Player()];

var player = d3.select('svg')
  .selectAll('.player')
  .data(newPlayer)
  .enter()
  .append('svg:circle')
  .call(drag)
  .attr("class", "player")
  .attr("fill", function(d) { return d.color })
  .attr("cx", function(d) { return axes.x(50) })
  .attr("cy", function(d) { return axes.y(50) })
  .attr("r", function(d) { return d.r })

var renderEnemies = function() {
  var enemies = d3.select('svg').selectAll('circle.enemy').data(createEnemies, function(d) {
    return d.id }
  );

  enemies.enter().append('svg:circle').attr("class", "enemy").attr("fill", "black")
  .attr("cx", function(d) {
    return axes.x(d.x)
  })
  .attr("cy", function(d) {
    return axes.y(d.y)
  })
  .attr("r", gameOptions.enemyRadius);

  enemies.exit().remove();

  /*.transition()
  .duration(1000)
  .tween("custom", detectCollision)
  */

  return enemies.transition().duration(1000).tween('custom', detectCollision);
};

setInterval(function() {
  renderEnemies();
  // console.log("DONE AT SETINTERVAL")
}, 1000)

// setInterval( function() {
//   d3
//   .selectAll('circle.enemy')
//   .transition()
//   .duration(1000)
//   .attr("cx", function(d) {
//     d.x = Math.random() * 100;
//     return axes.x(d.x);
//    })
//   .attr("cy", function(d) {
//     d.y = Math.random() * 100;
//     return axes.y(d.y);
//    })
//   .tween("custom", detectCollision)
// }
// , 1000)

var detectCollision = function(item) {
  var enemy = d3.select(this);

  var newCoords = {
    x: Math.random() * 100,
    y: Math.random() * 100
  }
  // in the return function, we need to use the percentage to calculate the difference 
  // between the new coordinates and the old coodinates 
  var old = item;
  var oldData = {
    cx: parseFloat(enemy.attr('cx')),
    cy: parseFloat(enemy.attr('cy'))
  };

  var newData = {
    x: axes.x(newCoords.x),
    y: axes.y(newCoords.y)
  };

  return function(percent) {

    var nextPos = {
      x: oldData.cx + (newData.x - oldData.cx) * percent,
      y: oldData.cy + (newData.y - oldData.cy) * percent
    };
    console.log(nextPos);
    return enemy.attr('cx', nextPos.x).attr('cy', nextPos.y);
    // console.log(d3.select(this).attr("cx"))
    //console.log(item);
    //console.log(percent);
    // console.log(this);
    // console.log(d3.select(this).attr("cx"));
    //console.log("old position is " + item.x + "(" + item.id + ") while new position is: " + d3.select(this).attr("cx") + "(" + d3.select(this).data()[0].id + ")");
    //console.log(item, d3.select(this));
    //d3.select(this).attr("cx", Math.random()*100);
    //console.log(item, t);
    // var old = item;
    // var newData = d3.select(this).data()[0];

    // if (old.id == 0) {
    //    console.log("Old: " + old.x + " | New: " + newData.x + " | Difference: " + (old.x - newData.x) + " | Percent: " + percent);
    // }
    //d3.select(this).attr("")
    // console.log("FINISHED AT DETECT COLLISION");


    // // i don't know how to make this happen for each enemy element 
    // var player = d3.select('svg').selectAll('.player');
    // var enemies = d3.select('svg').select('.enemy');
    // var sumRadius = parseInt(player.attr("r")) + parseInt(this.attr("r"));

    // var distance = Math.sqrt(Math.pow(Math.abs(player.attr("cx") - this.attr("cx")), 2) + Math.pow(Math.abs(player.attr("cy") - enemy.attr("cy")), 2)); // pyth
    // return distance;
    // if (distance < sumRadius) {
    //   d3.select('gameboard').style('background-color', 'red');
    //   console.log("you collided");
    // }
  }
}

setInterval(function() {
  gameStats.score++;
  updateScore()
}, 50);