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
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  d3.select(".high").text("High score: " + gameStats.bestScore.toString());
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
  this.r = 10;
  this.x = gameOptions.width/2;
  this.y = gameOptions.height/2;
  this.color = "red";
};

var drag = d3.behavior.drag()
    .on("drag", dragmove);

function dragmove(d) {
  var playerRadius = player.data()[0].r;
  d3.select(this)
      .attr("cx", d.x = Math.max(playerRadius, Math.min(gameOptions.width - playerRadius, d3.event.x)))
      .attr("cy", d.y = Math.max(playerRadius, Math.min(gameOptions.height - playerRadius, d3.event.y)));
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

  return enemies.transition().duration(1000).tween('custom', detectCollision);
};

setInterval(function() {
  renderEnemies();
}, 1000)

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

    var enemyPos = {
      x: Math.round(oldData.cx + (newData.x - oldData.cx) * percent),
      y: Math.round(oldData.cy + (newData.y - oldData.cy) * percent)
    };
    enemy.attr('cx', enemyPos.x).attr('cy', enemyPos.y);

    var playerPos = player.data()[0];

    var distance = Math.sqrt(Math.pow(Math.abs(playerPos.x - enemyPos.x), 2) + Math.pow(Math.abs(playerPos.y - enemyPos.y), 2));
    var sumRadius = playerPos.r + gameOptions.enemyRadius;

    if (distance < sumRadius) {
      gameStats.collisions++;
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