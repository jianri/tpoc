'use strict';

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http, $location, $rootScope) {

    $scope.mnuDashActive = "";
    $scope.mnuActionPlanActive = "inactive";
             
    $scope.loadValues = function(){
         console.log('Load Data');
         $http.post('/api/loadbase', {}, {}).
         success(function (data, status, headers, config) {
             console.log(data);
             $rootScope.basedata = data;
         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
             
         $http.post('/api/loadcolor', {}, {}).
         success(function (data, status, headers, config) {
             console.log(data);
             $rootScope.colordata = data;
         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
         
         $http.post('/api/loaditem', {}, {}).
         success(function (data, status, headers, config) {
             console.log(data);
             $rootScope.itemdata = data;
         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
    };

    $scope.loadValues();

    $scope.goView = function(view){
         $location.path(view);
    }
    
  }).
  controller('ViewCtrl1', function ($scope, $http, $rootScope) {
    //Controller for View1
    $scope.categoryname = $rootScope.basedata.categoryname;
    $scope.arealabel = $rootScope.basedata.arealabel;
    $scope.colorName = $rootScope.colordata.panelcolor;
             
    $scope.showColorPanelFlag = false;

    $scope.saveColor = function(colorData){
         $http.post('/api/savecolor', {data:colorData}, {}).
         success(function (data, status, headers, config) {
             console.log("Success:"+data);
             $scope.colorName = colorData.panelcolor;
             $rootScope.colordata = colorData;
             $scope.showColorPanelFlag = false;
         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
    };
  }).
  controller('ViewCtrl2', function ($scope, $http, $rootScope) {
     //Controller for View2
     $scope.categoryname = $rootScope.basedata.categoryname;
     $scope.arealabel = $rootScope.basedata.arealabel;
     $scope.categorylabel = $rootScope.basedata.categorylabel;
     $scope.colorName = $rootScope.colordata.panelcolor;
     $scope.reasonContent = $rootScope.itemdata.reasonContent;
     $scope.solutionContent = $rootScope.itemdata.solutionContent;
     $scope.supportContent = $rootScope.itemdata.supportContent;

     $scope.showEditPanelFlag = false;
    
     $scope.saveItem = function(){
         console.log('Save Item');
         var sendData = {
             reasonContent:$scope.reasonContent,
             solutionContent:$scope.solutionContent,
             supportContent:$scope.supportContent
         };
         $http.post('/api/saveitem', {data:sendData}, {}).
         success(function (data, status, headers, config) {
             console.log("Success:"+data);
             $scope.showEditPanelFlag = false;
             $rootScope.itemdata = sendData;
         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
     };
  });