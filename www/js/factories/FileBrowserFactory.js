FileBrowserApp.factory("$fileBrowserFactory", ['$q', function ($q) {

  var File = function () {};
  File.prototype = {

    getParentDirectory: function (path) {
      var deferred = $q.defer();
      window.resolveLocalFileSystemURL(path, function (fileSystem) {
        fileSystem.getParent(function (result) {
          deferred.resolve(result);
        }, function (error) {
          deferred.reject(error);
        });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },

    getEntriesAtRoot: function () {
      var deferred = $q.defer();
      window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (fileSystem) {
        var directoryReader = fileSystem.createReader();
        directoryReader.readEntries(function (entries) {
          deferred.resolve(entries);
        }, function (error) {
          deferred.reject(error);
        });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },

    getEntries: function (path) {
      var deferred = $q.defer();
      window.resolveLocalFileSystemURL(path, function (fileSystem) {
        var directoryReader = fileSystem.createReader();
        directoryReader.readEntries(function (entries) {
          var regEx = /(?:\.([^.]+))?$/;
          for (i = 0; i < entries.length; i++) {
            if (entries[i].isFile) {
              entries[i].extension = regEx.exec(entries[i].fullPath);
              entries[i].isBackButton = false;
            }
          }
          deferred.resolve(entries);
        }, function (error) {
          deferred.reject(error);
        });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },

    compareDirEntryNames: function (a, b) {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    },

    compareDirEntryModifiedDates: function (a, b) {
      return  new Date(b.lastModifiedDateTime) - new Date(a.lastModifiedDateTime);
    }
  };

  return File;
}]);
