function PostCtrl($scope, $routeParams, $location, database) {
  $scope.item = database.getItemById($routeParams.id);
}

PostCtrl.$inject = ['$scope', '$routeParams', '$location', 'database'];
