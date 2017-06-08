FileBrowserApp.controller('FileBrowserController',
  function ($scope, $filter, $state, $ionicPlatform, $ionicModal, $ionicPopup, $ionicLoading, $cordovaFile, $cordovaDevice, $fileBrowserFactory,
    $fileBrowserRestService, $fileSecurityService, $commonUtilityFactory, $loggingFactory) {

    var fbf = new $fileBrowserFactory();
    var fbs = new $fileBrowserRestService();
    var logger = new $loggingFactory();
    var commons = new $commonUtilityFactory();
    var fileSecurity = new $fileSecurityService();

    $ionicPlatform.ready(function () {

      var deviceFolders = [];
      $scope.backButtonDirEntry = null;
      $scope.networkNotAccessable = false;
      $scope.noFilesInCurrentSelectedFolder = false;
      $scope.adminFoldersNotSetupForDeviceType = false;

     
      $scope.isListView = false;
      $scope.toggleListView = function (value) {
        $scope.isListView = value;
      }

      // show load indicator for service call wait times.
      $ionicLoading.show({
        template: '<p>Loading Device Folders...</p><ion-spinner></ion-spinner>'
      });

      // get current environment configuration and then continue with app load
      commons.getCurrentEnvironmentConfig().then(function (envData) {
        // get device information for device type id
        fbs.getDeviceTypeInformation(envData.data, device.serial).then(function (deviceTypeData) {

          if (deviceTypeData.data.length === 0) {
            $scope.networkNotAccessable = true;
            $ionicLoading.hide();
            return;
          }

          // this needs removed before moving to production, my device was not registered so I added this for testing.
          //fbs.getUserDeviceTypeDetails(envData.data, device.serial, deviceTypeData.data[0].EmployeeNumber).then(function (userCheckoutDeviceData) {
          fbs.getUserDeviceTypeDetails(envData.data, device.serial, '941350').then(function (userCheckoutDeviceData) {
            // get array of all root directory entries
            fbf.getEntriesAtRoot().then(function (dirEntries) {
              // get array of all file browser configurations
              fbs.getDeviceTypeFolders(envData.data, userCheckoutDeviceData.data.DeviceTypeID).then(function (response) {
                if (response.data.length === 0) {
                  $scope.rootFiles = [];
                  $scope.files = $scope.rootFiles;
                  $ionicLoading.hide();
                  $scope.adminFoldersNotSetupForDeviceType = true;
                  return;
                } 
                // loop through each root directory checking if it is in the file browser config array
                for (var dirKey in dirEntries) {
                  for (var dataKey in response.data) {
                    // if check matches then add to deviceFolders array for final display otherwise discard.
                    if (dirEntries[dirKey].name === response.data[dataKey].FolderName) {
                      dirEntries[dirKey].Pin = response.data[dataKey].FolderPin;
                      deviceFolders.push(dirEntries[dirKey]);
                      break;
                    }
                  }
                }
                $scope.rootFiles = deviceFolders.sort(fbf.compareDirEntryNames);
                $scope.files = $scope.rootFiles;
                $ionicLoading.hide();
              }, function (err) {
                logger.logMessageAndErrorToConsole('Error getting device folders, cannot load application.', err);
              });
            }, function (err) {
              logger.logMessageAndErrorToConsole('Error getting entries at root, cannot load application.', err);
            });
          }, function (err) {
            logger.logMessageAndErrorToConsole('Error getting user checkout info, cannot load application.', err);
          });
        }, function (err) {
          logger.logMessageAndErrorToConsole('Error getting device info, cannot load application.', err);
        });
      }, function (err) {
        logger.logMessageAndErrorToConsole('Error getting cofig data, cannot load application.', err);
        });


      $scope.getContents = function (dirEntry) {

        if (dirEntry.isBackButton) {
          $scope.noFilesInCurrentSelectedFolder = false; 
        }

        if (!dirEntry.isBackButton && dirEntry.isFile) {
          window.cordova.plugins.FileOpener.openFile(decodeURIComponent(dirEntry.toURL()), function (data) {
            // success
          }, function (err) {
            logger.logMessageAndErrorToConsole('Error opening file on current device version.', err);
          });
          return;
        }

        if (dirEntry.fullPath === "/") {
          $scope.backButtonDirEntry = null;
          $scope.files = $scope.rootFiles;
        } else {
          if (!dirEntry.isBackButton && fileSecurity.hasFolderSecurityTimeoutExceeded(dirEntry)) {
            $scope.pinCode = "";
            $scope.dirEntry = dirEntry;
            $ionicModal.fromTemplateUrl('templates/pinCode.html', function (modal) {
              $scope.modal = modal;
              $scope.modal.show();
            }, {
                scope: $scope,
                animation: 'slide-in-up'
              });
          } else {
            fbf.getEntries(dirEntry.nativeURL).then(function (result) {
              result.length === 0 ? $scope.noFilesInCurrentSelectedFolder = true : $scope.noFilesInCurrentSelectedFolder = false;
              $scope.files = result.sort(fbf.compareDirEntryNames);
              $scope.backButtonDirEntry = null;
              fbf.getParentDirectory(dirEntry.nativeURL).then(function (result) {
                result.isBackButton = true;
                $scope.backButtonDirEntry = result;
              });
            });
          }
        }
      }
    });
  });
