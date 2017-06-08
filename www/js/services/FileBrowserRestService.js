FileBrowserApp.factory("$fileBrowserRestService", ['$http', '$commonUtilityFactory', function ($http) {

  var FileBrowserRestServices = function () { };

  FileBrowserRestServices.prototype = {

    getDeviceTypeInformation: function (environment, serial) {
      switch (environment.Name) {
        case "LOCAL":
          return $http.get('../data/device-info.json');
        default:
          return $http.get(environment.Protocol + '://' + environment.Domain + '/' + environment.DeviceServiceURL + '/GetDeviceDetails?fieldName=Serial&fieldValue=' + serial);
      }
    },

    getUserDeviceTypeDetails: function (environment, serial, employeeNumber) {
      switch (environment.Name) {
        case "LOCAL":
          return $http.get('../data/device-info.json');
        default:
          return $http.get(environment.Protocol + '://' + environment.Domain + '/' + environment.UserCheckoutServiceURL + '/GetUserDeviceInfo?serialNumber=' + serial + '&employeeNumber=' + employeeNumber);
      }
    },

    getDeviceTypeFolders: function (environment, deviceType) {
      switch (environment.Name) {
        case "LOCAL":
          return $http.get('../data/device-config.json');
        default: {
          return $http.get(environment.Protocol + '://' + environment.Domain + '/' + environment.FileBrowserServiceURL + '/GetFileBrowserConfigurationsByDeviceType?deviceType=' + deviceType);
        }
      }
    }
  };

  return FileBrowserRestServices;
}]);
