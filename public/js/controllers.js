'use strict';

angular.module('myApp.controllers', [])
.factory('MenuService', function($rootScope){
      var flag = {
          activeflag:false,
          setFlag:function(flag){
              this.activeflag = flag;
              $rootScope.$broadcast('setactiveflag');
          }
      };
      return flag;
})
.factory('SceneService', function($rootScope){
     var scene = {
         currentscene:false,
         setScene:function(view){
             this.currentscene = view;
             $rootScope.$broadcast('setScene');
         }
     };
     return scene;
}).
controller('AppCtrl', function ($scope, $http, $location, $rootScope, MenuService, SceneService) {
           
    $scope.loadValues = function(){
       $http.post('/api/loadcolor', {}, {}).
       success(function (data, status, headers, config) {
           $scope.savedflag = data.savedflag;
       }).
       error(function (data, status, headers, config) {
           console.log("Error:"+status);
       });
    };

    $scope.loadValues();
           
    $scope.goView = function(view){
        if(view == '/view1'){
            $location.path(view);
        }else{
            if($scope.savedflag){
                $location.path(view);
            }
        }
    }
             
    $scope.$on('setScene', function(){
        if(SceneService.currentscene=='view1'){
            $scope.mnuDashActive = "";
            $scope.mnuActionPlanActive = "inactive";
        }else{
            $scope.mnuDashActive = "inactive";
            $scope.mnuActionPlanActive = "";
        }
    });

    $scope.$on('setactiveflag', function(){
        $scope.savedflag = MenuService.activeflag;
        if(MenuService.activeflag){
            $scope.mnuActionPlanActive = "";
        }else{
            $scope.mnuActionPlanActive = "inactive";
        }
    });
    
  }).
  controller('ViewCtrl1', function ($scope, $http, $rootScope, $location, MenuService, SceneService) {
    //Controller for View1
    $http.post('/api/loadbase', {}, {}).
    success(function (data, status, headers, config) {
         $scope.categoryname = data.categoryname;
         $scope.arealabel = data.arealabel;
         $scope.categorylabel = data.categorylabel;
    }).
    error(function (data, status, headers, config) {
        console.log("Error:"+status);
    });
             
    $http.post('/api/loadcolor', {}, {}).
    success(function (data, status, headers, config) {
        $scope.colorName = data.panelcolor;
        $scope.savedflag = data.savedflag;
    }).
    error(function (data, status, headers, config) {
        console.log("Error:"+status);
    });

    $scope.showColorPanelFlag = false;
             
    SceneService.setScene('view1');
    
    $scope.showColorPanel = function(){
        if(!$scope.savedflag){
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

             $scope.savedflag = true;
             MenuService.setFlag(true);
             $scope.showColorPanelFlag = false;
             $location.path('/view2');
         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
    };
             
    $scope.reset = function(){//Reset
         $http.post('/api/initdata', {}, {}).
         success(function (data, status, headers, config) {
                 $scope.colorName = 'green';

                 $scope.savedflag = false;
                 MenuService.setFlag(false);
                 
                 $scope.showColorPanelFlag = false;
         }).
         error(function (data, status, headers, config) {
               console.log("Error:"+status);
         });
    };
  }).
  controller('ViewCtrl2', function ($scope, $http, $rootScope, SceneService) {
     //Controller for View2
     $scope.nullcontent = {
         reason:'(enter a reason)',
         solution:'(enter a solution and date)',
         support:'(enter support needed)'
     };
     
     $scope.loaddata = function(){
         $http.post('/api/loadbase', {}, {}).
         success(function (data, status, headers, config) {
                 $scope.categoryname = data.categoryname;
                 $scope.arealabel = data.arealabel;
                 $scope.categorylabel = data.categorylabel;
         }).
         error(function (data, status, headers, config) {
               console.log("Error:"+status);
         });
         
         $http.post('/api/loadcolor', {}, {}).
         success(function (data, status, headers, config) {
             $scope.colorName = data.panelcolor;
         }).
         error(function (data, status, headers, config) {
               console.log("Error:"+status);
         });
                 
         $http.post('/api/loaditem', {}, {}).
         success(function (data, status, headers, config) {
             $scope.initItem = data;

             if(data.reasonContent){
                 $scope.reasonContent = data.reasonContent;
                 $scope.nullcontent1 = "";
             }else{
                 $scope.reasonContent = $scope.nullcontent.reason;
                 $scope.nullcontent1 = "placeholder";
             }
             if(data.solutionContent){
                 $scope.solutionContent = data.solutionContent;
                 $scope.nullcontent2 = "";
             }else{
                 $scope.solutionContent = $scope.nullcontent.solution;
                 $scope.nullcontent2 = "placeholder";
             }
             if(data.supportContent){
                 $scope.supportContent = data.supportContent;
                 $scope.nullcontent3 = "";
             }else{
                 $scope.supportContent = $scope.nullcontent.support;
                 $scope.nullcontent3 = "placeholder";
             }
         }).
         error(function (data, status, headers, config) {
               console.log("Error:"+status);
         });
                 
         SceneService.setScene('view2');
     }

     $scope.showEditPanelFlag = false;
             
     $scope.showEditPanel = function(){
         $scope.showEditPanelFlag = true;
         $scope.reasonEditContent = $scope.initItem.reasonContent;
         $scope.solutionEditContent = $scope.initItem.solutionContent;
         $scope.supportEditContent = $scope.initItem.supportContent;
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
             console.log("Success:"+JSON.stringify(sendData));

             $scope.showEditPanelFlag = false;
                 
             $scope.initItem = sendData;
             if(sendData.reasonContent){
                 $scope.reasonContent = sendData.reasonContent;
                 $scope.nullcontent1 = "";
             }else{
                 $scope.reasonContent = $scope.nullcontent.reason;
                 $scope.nullcontent1 = "placeholder";
             }
             if(sendData.solutionContent){
                 $scope.solutionContent = sendData.solutionContent;
                 $scope.nullcontent2 = "";
             }else{
                 $scope.solutionContent = $scope.nullcontent.solution;
                 $scope.nullcontent2 = "placeholder";
             }
             if(sendData.supportContent){
                 $scope.supportContent = sendData.supportContent;
                 $scope.nullcontent3 = "";
             }else{
                 $scope.supportContent = $scope.nullcontent.support;
                 $scope.nullcontent3 = "placeholder";
             }
         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
     };
     
  });