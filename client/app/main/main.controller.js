'use strict';

angular.module('codemagnetAppApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    $scope.days = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      $scope.days = allDays();
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if (!$scope.newThingName || !$scope.newThingUrl) {
        return;
      } else {
        $http.post('/api/things', { name: $scope.newThingName, url: $scope.newThingUrl, created_at: Date.now() });
        $scope.newThingName = '';
        $scope.newThingUrl = '';
      }
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.incrementUpvotes = function(thing) {
      $http.put('/api/things/' + thing._id + '/upvote');
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    var allDays = function() {
      // Today
      var today = new Date();
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();

      // 5DaysAgo
      var fiveDaysAgo = new Date(tYear, tMonth, tDate - 5);
      var fYear = fiveDaysAgo.getFullYear();
      var fMonth = fiveDaysAgo.getMonth();
      var fDate = fiveDaysAgo.getDate();

      var days = []
      for (var i = 0; i < 5; i++) {
        var oneDay = new Date(tYear, tMonth, tDate - i);
        days.push(oneDay);
      };
      return days;
    };
  });
