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

var renderEnemies = d3.select('svg')
  .selectAll('circle')
  .data(createEnemies, function(d) { return d.id })
  .enter()
  .append('svg:circle')
  .transition()
  .attr("fill", "black")
  .attr("cx", function(d) { return axes.x(d.x) })
  .attr("cy", function(d) { return axes.y(d.y) })
  .attr("r", gameOptions.enemyRadius)

setInterval( function() {
  d3
  .selectAll('circle')
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
