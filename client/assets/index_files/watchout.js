// start slingin' some d3 here.

var gameOptions = {
  height: 600,
  width: 800,
  enemies: 15,
  padding: 20,
  enemyRadius: 15
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0,
  collided: false
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
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  d3.select(".high").transition().duration(500).style("background-color", "yellow").text("High score: " + gameStats.bestScore.toString()).transition().duration(500).style("background-color", "");
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
  this.r = 15;
  this.x = gameOptions.width/2;
  this.y = gameOptions.height/2;
  this.color = "red";
};

var drag = d3.behavior.drag()
    .on("drag", dragmove);

function dragmove(d) {
  var playerRadius = player.data()[0].r;
  d3.select(this)
      .attr("x", d.x = Math.max(playerRadius, Math.min(gameOptions.width - playerRadius, d3.event.x)) - playerRadius)
      .attr("y", d.y = Math.max(playerRadius, Math.min(gameOptions.height - playerRadius, d3.event.y)) - playerRadius);
}

var newPlayer = [new Player()];

var player = d3.select('svg')
  .selectAll('.player')
  .data(newPlayer)
  .enter()
  .append('svg:image')
  .call(drag)
  .attr("class", "player")
  .attr("width", "30px")
  .attr("height", "30px")
  .attr("xlink:href", "assets/unamused.png")
  .attr("x", function(d) { return axes.x(50) })
  .attr("y", function(d) { return axes.y(50) })
  .attr("r", function(d) { return d.r })

var renderEnemies = function() {
  var enemies = d3.select('svg').selectAll('image.enemy').data(createEnemies, function(d) {
    return d.id }
  );

  enemies.enter().append('image').attr("class", "enemy")
  .attr("xlink:href", "assets/poop.png")
  .attr("width", "30px")
  .attr("height", "30px")
  .attr("x", function(d) {
    return axes.x(d.x)
  })
  .attr("y", function(d) {
    return axes.y(d.y)
  })
  .attr("r", gameOptions.enemyRadius);

  enemies.exit().remove();

  enemies.transition().duration(1000).tween('custom', detectCollision);
};

setInterval(function() {
  renderEnemies();
  gameStats.collided = false;
}, 1000)

var detectCollision = function(item) {
  console.log(item);
  var enemy = d3.select(this);
  console.log(enemy);

  var newCoords = {
    x: Math.random() * 100,
    y: Math.random() * 100
  }
  // in the return function, we need to use the percentage to calculate the difference 
  // between the new coordinates and the old coodinates 
  var old = item;
  var oldData = {
    x: parseFloat(enemy.attr('x')),
    y: parseFloat(enemy.attr('y'))
  };

  var newData = {
    x: axes.x(newCoords.x),
    y: axes.y(newCoords.y)
  };

  return function(percent) {

    var enemyPos = {
      x: Math.round(oldData.x + (newData.x - oldData.x) * percent),
      y: Math.round(oldData.y + (newData.y - oldData.y) * percent)
    };
    enemy.attr('x', enemyPos.x).attr('y', enemyPos.y);

    var playerPos = player.data()[0];

    var distance = Math.sqrt(Math.pow(Math.abs(playerPos.x - enemyPos.x), 2) + Math.pow(Math.abs(playerPos.y - enemyPos.y), 2));
    var sumRadius = playerPos.r + gameOptions.enemyRadius;

    if (distance < sumRadius && !gameStats.collided) {
      gameStats.collided = true;
      gameStats.collisions++;
      d3.select("svg").style("background", "#A00").transition().duration(500).style("background", "white");
      updateBestScore();
      updateCollisionCount();
      gameStats.score = 0;
      console.log("You've been hit!");
    }
  }
}

setInterval(function() {
  gameStats.score++;
  updateScore()
}, 50);