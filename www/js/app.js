// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var App = angular.module('App', ['ionic']);

App.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

App.controller('AppCtrl', ['$scope', '$log', '$ionicPopup', AppCtrl]);

function AppCtrl($scope, $log, $ionicPopup){
  $scope.host = {};
  $scope.host.ip = "10.17.219.124:9092";
  $scope.isReconnected = false;
  $scope.isConnected = false;
  $scope.items = [];
  $scope.chatSocket;
  $scope.nickName;
  $scope.message = '';
  $scope.setting = function(){
    // $scope.host = {};
  // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="host.ip">',
      title: 'Server Host',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.host.ip) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.host.ip;
            }
          }
        },
      ]
    });
  }
  $scope.join = function(nickName){
    if(nickName!='' && !$scope.isConnected){
      if($scope.isReconnected){
        $scope.chatSocket.socket.reconnect('http://' + $scope.host.ip + '/chat');
      }else{
        $scope.chatSocket =  io.connect('http://' + $scope.host.ip + '/chat'); 
      }
      
      $scope.chatSocket.on('connect', function(){
        $scope.isConnected = true; 
        $scope.isReconnected = true;
        $scope.$apply();
        $scope.chatSocket.emit('registEvent', nickName);
        $scope.nickName = nickName;  
        // $scope.items.unshift('Client has connected to the server!'); 
      });
      $scope.chatSocket.on('chatevent', function(data){
        $scope.items.unshift(data.userName + ": " + data.message);
        $scope.$apply();
      });
      $scope.chatSocket.on('disconnect', function(){
        $scope.isConnected = false;
        $scope.items.unshift("断开连接");

        $scope.chatSocket.removeAllListeners();
        // $scope.$apply();  
      });
      
    }
  }
  $scope.disconnect = function(){
    if($scope.isConnected){
      $scope.chatSocket.disconnect();
    }
      
  }
  $scope.sendMessage = function(){
    // $scope.items.unshift(message);
    // alert(message); 
    var jsonObject = {'@class': 'org.boom.socketio.server.message.MessageVO',
                              userName: $scope.nickName, 
                              message: $scope.message};
    // chatSocket.json.send(jsonObject);
    $scope.chatSocket.emit('chatevent', jsonObject);
    $scope.message = '';
  }


}
