// start slingin' some d3 here.

var gameOptions = {
  height: 600,
  width: 800,
  enemies: 25,
  padding: 20,
  enemyRadius: 10
};

var gameStats = {
  score: 0,
  bestScore: 0
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
  d3.select(".current").text(gameStats.score.toString());
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

// var enemiesArray = []; 

// var createEnemies = function() {
//   for (var i = 0; i < gameOptions.enemies; i++) {
//     var enemy = {};
//     enemy.id = i;
//     enemy.x = Math.random() * 100;
//     enemy.y = Math.random() * 100;
//     enemiesArray.push(enemy);
//   }
//   return enemiesArray;
//   // run check collisions inside create enemies - 
// }

var Player = function() {
  this.r  = 5;
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
  .transition()
  .duration(2000)
  .attr("class", "player")
  .attr("fill", function(d) { return d.color })
  .attr("cx", function(d) { return axes.x(50) })
  .attr("cy", function(d) { return axes.y(50) })
  .attr("r", function(d) { return d.r })
  .transition()
  .duration(2000)
  .attr("r", "20px")

var enemy = d3.select('svg')
  .selectAll('circle.enemy')
  .data(createEnemies, function(d) { return d.id })
  .enter()
  .append('svg:circle')
  .transition()
  .attr("class", "enemy")
  .attr("fill", "black")
  .attr("cx", function(d) { return axes.x(d.x) })
  .attr("cy", function(d) { return axes.y(d.y) })
  .attr("r", gameOptions.enemyRadius)


setInterval( function() {
  d3
  .selectAll('circle.enemy')
  .transition()
  .duration(1000)
  .attr("cx", function(d) {
    d.x = Math.random() * 100;
    return axes.x(d.x);
   })
  .attr("cy", function(d) {
    d.y = Math.random() * 100;
    return axes.y(d.y);
   })
}
, 1000)

var detectCollision = function(item) {
  // i don't know how to make this happen for each enemy element 
  var player = d3.select('svg').selectAll('.player');
  var enemies = d3.select('svg').select('.enemy');
  // var sumRadius = parseInt(player.attr("r")) + parseInt(this.attr("r"));
  console.log(enemies);
  // var distance = Math.sqrt(Math.pow(Math.abs(player.attr("cx") - this.attr("cx")), 2) + Math.pow(Math.abs(player.attr("cy") - enemy.attr("cy")), 2)); // pyth
  // return distance;
  // if (distance < sumRadius) {
    // d3.select('gameboard').style('background-color', 'red');
    // console.log("you collided");
  // }
}

// _.each(createEnemies(), function(item) { detectCollision.call(item)} )