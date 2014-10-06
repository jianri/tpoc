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

    $scope.setColor = function(colorData){//when click color on color panel
         $scope.colorName = colorData.panelcolor;
    };
             
    $scope.saveColor = function(){//Click when done
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
     $scope.maxExceedMsg = '(exceeds maximum text length)';
     
     $scope.loaddata = function(){
             console.log('loading data');
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
             //console.log($scope.colorName);
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
             
     $scope.loaddata();

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
             reasonContent: $scope.reasonEditContent,
             solutionContent: $scope.solutionEditContent,
             supportContent: $scope.supportEditContent
         };
         $http.post('/api/saveitem', {data:sendData}, {}).
         success(function (data, status, headers, config) {
             console.log("Success:"+JSON.stringify(sendData));

             $scope.showEditPanelFlag = false;
             $scope.initItem = sendData;

         }).
         error(function (data, status, headers, config) {
             console.log("Error:"+status);
         });
     };
     
     $scope.cancelItem = function(){
         if($scope.initItem.reasonContent){
             $scope.reasonContent = $scope.initItem.reasonContent;
             $scope.nullcontent1 = "";
         }else{
             $scope.reasonContent = $scope.nullcontent.reason;
             $scope.nullcontent1 = "placeholder";
         }
         if($scope.initItem.solutionContent){
             $scope.solutionContent = $scope.initItem.solutionContent;
             $scope.nullcontent2 = "";
         }else{
             $scope.solutionContent = $scope.nullcontent.solution;
             $scope.nullcontent2 = "placeholder";
         }
         if($scope.initItem.supportContent){
             $scope.supportContent = $scope.initItem.supportContent;
             $scope.nullcontent3 = "";
         }else{
             $scope.supportContent = $scope.nullcontent.support;
             $scope.nullcontent3 = "placeholder";
         }
         $scope.showEditPanelFlag = false;
     };
     
     $scope.$watch('reasonEditContent', function(){
       if(!$scope.reasonEditContent){
           $scope.reasonContent = $scope.nullcontent.reason;
           $scope.nullcontent1 = "placeholder";
       }else{
           $scope.nullcontent1 = "";
           $scope.reasonContent = $scope.reasonEditContent;
           setTimeout(function(){
              
              if(document.getElementById('divReasonContent')){
                  if(document.getElementById('divReasonContent').offsetHeight<37){
                      $scope.$apply(function(){
                          $scope.prevReasonContent = $scope.reasonEditContent;
                      });
                  }else{
                      $scope.$apply(function(){
                          $scope.reasonEditContent = $scope.prevReasonContent;
                          $scope.reasonContent = $scope.prevReasonContent;
                      });
                  }
              }
           }, 2);
       }
     });
     
     $scope.$watch('solutionEditContent', function(){
       if(!$scope.solutionEditContent){
           $scope.solutionContent = $scope.nullcontent.solution;
           $scope.nullcontent2 = "placeholder";
       }else{
           $scope.nullcontent2 = "";
           $scope.solutionContent = $scope.solutionEditContent;
           setTimeout(function(){
                  
              if(document.getElementById('divSolutionContent')){
                  if(document.getElementById('divSolutionContent').offsetHeight<37){
                      $scope.$apply(function(){
                          $scope.prevSolutionContent = $scope.solutionEditContent;
                      });
                  }else{
                      $scope.$apply(function(){
                          $scope.solutionContent = $scope.maxExceedMsg;
                      });
                      setTimeout(function(){
                          $scope.$apply(function(){
                              $scope.solutionEditContent = $scope.prevSolutionContent;
                              $scope.solutionContent = $scope.prevSolutionContent;
                          });
                      }, 500);
                  }
              }
            }, 2);
       }
     });
             
     $scope.$watch('supportEditContent', function(){
       if(!$scope.supportEditContent){
           $scope.supportContent = $scope.nullcontent.support;
           $scope.nullcontent3 = "placeholder";
       }else{
           $scope.nullcontent3 = "";
           $scope.supportContent = $scope.supportEditContent;
           setTimeout(function(){
              if(document.getElementById('divSupportContent')){
                  if(document.getElementById('divSupportContent').offsetHeight<37){
                      $scope.$apply(function(){
                          $scope.prevSupportContent = $scope.supportEditContent;
                      });
                  }else{
                      $scope.$apply(function(){
                          $scope.supportEditContent = $scope.prevSupportContent;
                          $scope.supportContent = $scope.prevSupportContent;
                      });
                  }
              }
          }, 2);
       }
     });
  });