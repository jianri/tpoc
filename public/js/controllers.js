'use strict';

angular.module('myApp.controllers', []).factory('MenuService', function($rootScope){
      var flag = {
          activeflag:false,
          setFlag:function(flag){
              this.activeflag = flag;
              $rootScope.$broadcast('setactiveflag');
          }
      };
      return flag;
          }).
controller('AppCtrl', function ($scope, $http, $location, $rootScope, MenuService) {
           
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
                 if(!data.savedflag){
                 $scope.mnuActionPlanActive = "inactive";
                 }
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
        if($rootScope.mnuDisableFlag){
             $location.path(view);
        }
    }
             
    $scope.$on('setactiveflag', function(){
        if(MenuService.activeflag){
            $scope.mnuActionPlanActive = "";
        }else{
            $scope.mnuActionPlanActive = "inactive";
        }
    });
    
  }).
  controller('ViewCtrl1', function ($scope, $http, $rootScope, $location, MenuService) {
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

    $scope.saveColor = function(colorData){//when click color on color panel
         $scope.colorName = colorData.panelcolor;
    };
             
    $scope.setColor = function(){//Click when done
         $http.post('/api/savecolor', {data:{panelcolor:$scope.colorName, savedflag:true}}, {}).
         success(function (data, status, headers, config) {
             console.log("Success:"+JSON.stringify(data));
             
             $rootScope.colordata.panelcolor = $scope.colorName;
             $rootScope.mnuDisableFlag = true;
             MenuService.setFlag(true);
             $scope.showColorPanelFlag = false;
             $scope.clickdoneflag = true;
             $location.path('/view2');
         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
    };
             
    $scope.reset = function(){//Reset
         $http.post('/api/initdata', {}, {}).
         success(function (data, status, headers, config) {
                 console.log("Success:"+data);
                 $scope.colorName = 'green';
                 
                 $rootScope.colordata.panelcolor = 'green';
                 $rootScope.mnuDisableFlag = false;
                 MenuService.setFlag(false);
                 $rootScope.itemdata.reasonContent = "";
                 $rootScope.itemdata.solutionContent = "";
                 $rootScope.itemdata.supportContent = "";
                 
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
             console.log($rootScope.itemdata);

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