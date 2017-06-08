FileBrowserApp.factory("$commonUtilityFactory", ['$http', function ($http) {

  var Commons = function () {};

  Commons.prototype = {

    getCurrentEnvironmentConfig: function() {
      return $http.get('../config/fbconfig.json');
    }
  };

  return Commons;
}]);
