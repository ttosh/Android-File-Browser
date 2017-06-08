FileBrowserApp.controller('FileSecurityController', function ($scope, $ionicModal, $fileSecurityService) {

  $scope.pinCode = "";
  $scope.pinCodeError = "";
  var fs = new $fileSecurityService();

  $scope.clearPinCode = function() {
    $scope.pinCode = "";
    $scope.pinCodeError = "";
  };

  $scope.addDigit = function (value) {
    $scope.pinCodeError = "";
    $scope.pinCode += value;
    if ($scope.pinCode.length === 4) {
      if ($scope.pinCode === $scope.dirEntry.Pin) {
        $scope.modal.hide();
        fs.setPinForTimeoutInLocalStorage($scope.dirEntry);
        $scope.getContents($scope.dirEntry);
      } else {
        $scope.pinCodeError = "Incorrect pinCode...";
      }
    }
  };

  $scope.deleteDigit = function () {
    $scope.pinCodeError = "";
    if ($scope.pinCode === undefined) {
      $scope.clearPinCode();
    }
    if ($scope.pinCode.length > 0) {
      $scope.pinCode = $scope.pinCode.substring(0, $scope.pinCode.length - 1);
    }
  };

});
