angular.module("worldcup").controller("topscorers", function($scope, ioquery) {

	$scope.loaded = false;

	$scope.scorers = [];

	$scope.playerRanking = {
		"prolific": false,
		"potent": false,
		"bestValue": false,
		"worstValue": false
	}

	var load = function() {
		ioquery.query({
			"connectorGuids": [
				"a5c35d9c-b2de-4159-a092-627f0861c0bb"
			],
			"input": {
				"webpage/url": "http://www.bbc.co.uk/sport/football/world-cup/2014/top-scorers"
			}
		}, { "done": function(data) {
			$scope.$apply(function() {
				var sortable = [];
				$scope.scorers = data.map(function(row) {
					sortable.push(row.data);
					return row.data;
				});

				// Ranking: prolific
				$scope.playerRanking.prolific = $scope.scorers[0];

				// Ranking: potent
				sortable.sort(function(a, b) {
					return ((b.shots_on_target + b.assists + b.goals) - (a.shots_on_target + a.assists + a.goals));
				});
				$scope.playerRanking.potent = sortable[0];

				// Ranking: best value
				sortable.sort(function(a, b) {
					return (a.mins_per_goal - b.mins_per_goal);
				});
				$scope.playerRanking.bestValue = sortable[0];

				// Ranking: worst value
				sortable.sort(function(a, b) {
					return (b.mins_per_goal - a.mins_per_goal);
				});
				$scope.playerRanking.worstValue = sortable[0];

				$scope.loaded = true;
			});
		} });
	}
	load();

});