'use strict';

angular.module('myApp', [
  'myApp.controllers',
  'myApp.directives',
  'ngRoute'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/view1', {
      templateUrl: 'views/view1',
      controller: 'ViewCtrl1'
    }).
    when('/view2', {
      templateUrl: 'views/view2',
      controller: 'ViewCtrl2'
    }).
    otherwise({
      redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
});
