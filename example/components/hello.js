angular
  .module('app')
  .component('hello', {
    templateUrl: 'components/hello.html',
    controllerAs: 'helloC',
    controller: hello
  });

hello.$inject = ['$scope'];

function hello($scope) {
  $scope.data = {
    thLabel: ['nome', 'cognome', 'supercalifragilestichespiralitoso'],
    tdData: [
      ['vittorio', 'lo preiato', 1],
      ['lucia', 'cenacchi', 3]
    ]
  };
}
