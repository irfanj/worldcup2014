angular.module("worldcup").controller("headtohead", function($scope, ioquery) {

	$scope.teamsLoaded = false;

	$scope.teams = {};

	$scope.teams = {
		"first": "",
		"second": ""
	}

	$scope.teamReady = {
		"first": false,
		"second": true
	}

	$scope.teamData = {
		"first": {
			"players": [],
			"scorers": []
		},
		"second": {
			"players": [],
			"scorers": []
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
				$scope.teams = {};
				$scope.teamsLoaded = true;
				data.map(function(row) {
					$scope.teams[row.data.country_name] = row.data.link;
				});
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
				data.map(function(row) {
					var target = "scorers";
					if (row.connectorGuid == "d16e8c80-ae43-496d-8375-4fd0ebf3e0dc") {
						target = "players";
					}
					$scope.teamData[which][target].push(row.data);
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

});