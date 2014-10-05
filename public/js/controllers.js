'use strict';

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http, $location, $rootScope) {

    /*$scope.mnuDashActive = "";
    if($scope.showColorPanelFlag == false){
         $scope.mnuActionPlanActive = "inactive";
    }else{
         $scope.mnuActionPlanActive = "";
    }*/
             
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
             $rootScope.mnuDisableFlag = data.savedflag;
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
             //console.log($rootScope.mnuDisableFlag);
        if($rootScope.mnuDisableFlag){
             $location.path(view);
        }
    }
    
  }).
  controller('ViewCtrl1', function ($scope, $http, $rootScope) {
    //Controller for View1
    $scope.categoryname = $rootScope.basedata.categoryname;
    $scope.arealabel = $rootScope.basedata.arealabel;
    $scope.colorName = $rootScope.colordata.panelcolor;

    $scope.showColorPanelFlag = false;
    
    if($rootScope.mnuDisableFlag){
        $scope.clickdoneflag = true;
    }
    
    $scope.showColorPanel = function(){
        if(!$rootScope.mnuDisableFlag){
             $scope.showColorPanelFlag = true;
        }
    };

    $scope.saveColor = function(colorData){
         $scope.colorName = colorData.panelcolor;
    };
             
    $scope.setColor = function(){
         $http.post('/api/savecolor', {data:{panelcolor:$scope.colorName, savedflag:true}}, {}).
         success(function (data, status, headers, config) {
             console.log("Success:"+JSON.stringify(data));
             
             $rootScope.colordata.panelcolor = $scope.colorName;
             $rootScope.mnuDisableFlag = true;
             $scope.showColorPanelFlag = false;
             $scope.clickdoneflag = true;
         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
    };
             
    $scope.reset = function(){
         $http.post('/api/initcolor', {}, {}).
         success(function (data, status, headers, config) {
                 //console.log("Success:"+data);
                 $scope.colorName = 'green';
                 $rootScope.colordata.panelcolor = 'green';
                 $rootScope.mnuDisableFlag = false;
                 $scope.showColorPanelFlag = false;
                 $scope.clickdoneflag = false;
         }).
         error(function (data, status, headers, config) {
               console.log("Error:"+status);
         });
    };
  }).
  controller('ViewCtrl2', function ($scope, $http, $rootScope) {
     //Controller for View2
     $scope.nullcontent = {
         reason:'(Enter a reason)',
         solution:'(Enter a solution and date)',
         support:'(Enter support needed)'
     };
     $scope.categoryname = $rootScope.basedata.categoryname;
     $scope.arealabel = $rootScope.basedata.arealabel;
     $scope.categorylabel = $rootScope.basedata.categorylabel;

     $scope.colorName = $rootScope.colordata.panelcolor;

     if($rootScope.itemdata.reasonContent!=""){
         $scope.reasonContent = $rootScope.itemdata.reasonContent;
     }else{
         $scope.reasonContent = $scope.nullcontent.reason;
     }
     if($rootScope.itemdata.solutionContent!=""){
         $scope.solutionContent = $rootScope.itemdata.solutionContent;
     }else{
         $scope.solutionContent = $scope.nullcontent.solution;
     }
     if($rootScope.itemdata.supportContent!=""){
         $scope.supportContent = $rootScope.itemdata.supportContent;
     }else{
         $scope.supportContent = $scope.nullcontent.support;
     }

     $scope.showEditPanelFlag = false;
             
     $scope.showEditPanel = function(){
         $scope.showEditPanelFlag = true;
         $scope.reasonEditContent = $rootScope.itemdata.reasonContent;
         $scope.solutionEditContent = $rootScope.itemdata.solutionContent;
         $scope.supportEditContent = $rootScope.itemdata.supportContent;
     };
    
     $scope.saveItem = function(){
         console.log('Save Item');
         var sendData = {
             reasonContent:$scope.reasonEditContent,
             solutionContent:$scope.solutionEditContent,
             supportContent:$scope.supportEditContent
         };
         $http.post('/api/saveitem', {data:sendData}, {}).
         success(function (data, status, headers, config) {
             console.log("Success:"+data);
                 $scope.reasonContent = $scope.reasonEditContent;
                 $scope.solutionContent = $scope.solutionEditContent;
                 $scope.supportContent = $scope.supportEditContent;
             $scope.showEditPanelFlag = false;
             $rootScope.itemdata = sendData;
         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
     };
     
  });