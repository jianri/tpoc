'use strict';

angular.module('myApp.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }).
  directive('mnuMenu', function(){
    return {
        restrict:'A',
        templateUrl:'directives/mnuMenu.html',
        link:function(scope, element, attrs, location){
            scope.goView1 = function(){
                scope.goView('/view1');
            };
            
            scope.goView2 = function(){
                scope.goView('/view2');
            };
        }
    };
  }).
  directive('colorPanel', function(){
    return {
        restrict:'A',
        templateUrl:'directives/colorPanel.html',
        link:function(scope, element, attrs){
            
            scope.setPanelColor = function(colorname){
                var colordata = {panelcolor:colorname};
                scope.saveColor(colordata);
            };
        }
    };
  }).
  directive('editPanel', function(){
    return {
        restrict:'A',
        templateUrl:'directives/editPanel.html',
        link:function(scope, element, attrs){
            scope.savePanel = function(){
                scope.saveItem();
            };
            
            scope.cancelPanel = function(){
                scope.showEditPanelFlag = false;
            };
        }
    };
  });
