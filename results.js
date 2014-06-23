angular.module("worldcup").controller("results", function($scope, ioquery) {

	$scope.loaded = false;

	$scope.results = [];

	$scope.countries = {};

	$scope.countryRanking = {
		"prolific": false,
		"leaky": false
	}

	$scope.thrashing = false;

	$scope.date = function(stamp) {
		return moment(stamp).format("MMMM Do YYYY");
	}

	var load = function() {
		ioquery.query({
			"connectorGuids": [
				"b2ebe9ab-a662-4b3e-be6e-f0d2dba33ba3"
			],
			"input": {
				"webpage/url": "http://www.bbc.co.uk/sport/football/world-cup/results"
			}
		}, { "done": function(data) {
			$scope.$apply(function() {
				
				$scope.countries = {};

				var createCountry = function(name) {
					if (!$scope.countries.hasOwnProperty(name)) {
						$scope.countries[name] = {
							"name": name,
							"goals": 0,
							"goals_conceded": 0,
							"goal_diff": 0,
							"wins": 0,
							"draws": 0,
							"losses": 0,
							"plays": 0,
							"goals_per_game": 0,
							"goal_diff_per_game": 0
						}
					}
				}

				var recordCountryScore = function(name, goals_for, goals_against) {
					createCountry(name);
					$scope.countries[name].goals += goals_for;
					$scope.countries[name].goals_conceded += goals_against;
					$scope.countries[name].goal_diff += goals_for;
					$scope.countries[name].goal_diff -= goals_against;
					$scope.countries[name].plays++;
					if (goals_for > goals_against) {
						$scope.countries[name].wins++;
					} else if (goals_for < goals_against) {
						$scope.countries[name].losses++;
					} else {
						$scope.countries[name].draws++;
					}
					$scope.countries[name].goals_per_game = $scope.countries[name].goals / $scope.countries[name].plays;
					$scope.countries[name].goal_diff_per_game = $scope.countries[name].goal_diff / $scope.countries[name].plays;
				}

				$scope.results = data.map(function(row) {
					recordCountryScore(row.data.home_team_text, row.data.home_goals, row.data.away_goals);
					recordCountryScore(row.data.away_team_text, row.data.away_goals, row.data.home_goals);

					var row_diff = Math.abs(row.data.home_goals - row.data.away_goals);
					var current_diff = Math.abs($scope.thrashing.home_goals - $scope.thrashing.away_goals);
					var row_total = row.data.home_goals + row.data.away_goals;
					var current_total = $scope.thrashing.home_goals + $scope.thrashing.away_goals;
					if (!$scope.thrashing || row_diff > current_diff || (row_diff == current_diff && row_total > current_total)) {
						$scope.thrashing = row.data;
					}

					return row.data;
				});

				for (var k in $scope.countries) {
					if (!$scope.countryRanking.prolific || $scope.countries[k].goals_per_game > $scope.countryRanking.prolific.goals_per_game) {
						$scope.countryRanking.prolific = $scope.countries[k];
					}
					if (!$scope.countryRanking.leaky || $scope.countries[k].goal_diff_per_game < $scope.countryRanking.leaky.goal_diff_per_game) {
						$scope.countryRanking.leaky = $scope.countries[k];
					}
				}

				var chartData = [["Country", "Goals"]];
				for (var k in $scope.countries) {
					chartData.push([k, $scope.countries[k].goals]);
				}

				var chartOptions = {
					"width": "100%",
					"colorAxis": {
						"colors": [
							"#fff",
							"#e92076"
						]
					},
					"datalessRegionColor": "#fff",
					"legend": "none"
				}

				var chart = new google.visualization.GeoChart(document.getElementById("goal-map"));
				chart.draw(google.visualization.arrayToDataTable(chartData), chartOptions);

				$scope.loaded = true;
			});
		} });
	}
	load();

});