// start slingin' some d3 here.

var gameOptions = {
  height: 600,
  width: 800,
  enemies: 20,
  padding: 20,
  enemyRadius: 15
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0,
  collided: false,
  counter: 0
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
  var prev = gameStats.bestScore;
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  if (prev !== gameStats.bestScore) {
    d3.select(".high").transition().duration(250).style("background-color", "red").text("High score: " + gameStats.bestScore.toString()).transition().duration(500).style("background-color", "");
  }
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
  this.happinessLevel = 0;
};

var drag = d3.behavior.drag()
    .on("drag", dragmove);

function dragmove(d) {
  var playerRadius = player.data()[0].r;
  if (gameStats.counter > 100) {
    d3.select(".player").attr("xlink:href", "assets/" + player.data()[0].happinessLevel + ".png");
  }
  gameStats.counter = 0;
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
  .attr("xlink:href", "assets/" + newPlayer[0].happinessLevel + ".png")
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
      var happyLevel = player.data()[0].happinessLevel;
      if (happyLevel > 0) {
        happyLevel = 0;
      }

      gameStats.collided = true;
      gameStats.collisions++;

      if (gameStats.collisions === 5) {
        happyLevel = -1;
      } else if (gameStats.collisions === 10) {
        happyLevel = -2;
      } else if (gameStats.collisions >= 15) {
        happyLevel = -3;
      }

      gameStats.counter = 0;
      d3.select("svg").style("background", "#A00").transition().duration(500).style("background", "white");
      d3.select(".player").transition().duration(500).attr("xlink:href", "assets/dead.png").transition().duration(500).attr("xlink:href", "assets/" + happyLevel + ".png");
      updateBestScore();
      updateCollisionCount();
      gameStats.score = 0;
      console.log("You've been hit!");
      player.data()[0].happinessLevel = happyLevel;
    }
  }
}

setInterval(function() {
  gameStats.score++;
  gameStats.counter++;
  if (gameStats.score === 100) {

    player.data()[0].happinessLevel = 1;
    d3.select(".player").attr("xlink:href", "assets/" + player.data()[0].happinessLevel + ".png");
  }

  if (gameStats.counter > 100) {
    d3.select(".player").attr("xlink:href", "assets/zzz.png");
  }

  updateScore()
}, 50);