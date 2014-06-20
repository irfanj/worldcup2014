angular.module("worldcup").controller("headtohead", function($scope, ioquery) {

	$scope.teamsLoaded = false;

	$scope.availableTeams = {};

	$scope.teams = {
		"first": false,
		"second": false
	}

	$scope.teamReady = {
		"first": false,
		"second": false
	}

	$scope.teamData = {
		"first": {
			"players": {},
			"scorers": [],
			"goals": 0
		},
		"second": {
			"players": {},
			"scorers": [],
			"goals": 0
		}
	}

	var loadTeams = function() {
		if ($scope.teamsLoaded) {
			return;
		}
		ioquery.query({
			"connectorGuids": [
				"ab0b0a83-c857-4314-912c-80ed9271b990"
			],
			"input": {
				"webpage/url": "http://www.bbc.co.uk/sport/football/teams"
			}
		}, { "done": function(data) {
			$scope.$apply(function() {
				$scope.availableTeams = {};
				$scope.teamsLoaded = true;
				data.map(function(row) {
					$scope.availableTeams[row.data.country_name] = row.data.link;
				});
				$scope.teams.first = "http://www.bbc.co.uk/sport/football/teams/england";
				$scope.teams.second = "http://www.bbc.co.uk/sport/football/teams/usa";
			});
		} });
	}
	loadTeams();

	var loadTeam = function(url, which) {
		if (!url || !which) {
			return;
		}
		$scope.teamReady[which] = false;

		ioquery.query({
			"connectorGuids": [
				"d16e8c80-ae43-496d-8375-4fd0ebf3e0dc",
				"3fc1d0f5-f147-4f70-83a1-c1807a753b5b"
			],
			"input": {
				"webpage/url": url
			}
		}, { "done": function(data) {
			$scope.$apply(function() {
				$scope.teamData[which].scorers = [];
				$scope.teamData[which].players = {};
				$scope.teamData[which].goals = 0;
				data.map(function(row) {
					if (row.connectorGuid == "d16e8c80-ae43-496d-8375-4fd0ebf3e0dc") {
						if (!$scope.teamData[which].players.hasOwnProperty(row.data.position)) {
							$scope.teamData[which].players[row.data.position] = {};
						}
						$scope.teamData[which].players[row.data.position][row.data.number] = row.data.player;
					} else {
						$scope.teamData[which].scorers.push(row.data);
						$scope.teamData[which].goals += row.data.goals;
					}
				});
				$scope.teamReady[which] = true;
			});
		} });
	}
	$scope.$watch("teams.first", function() {
		loadTeam($scope.teams.first, "first");
	});
	$scope.$watch("teams.second", function() {
		loadTeam($scope.teams.second, "second");
	});

	$scope.count = function(obj) {
		return Object.keys(obj).length;
	}

});