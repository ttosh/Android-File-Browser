FileBrowserApp.factory("$fileSecurityService", function () {

  var FileSecurity = function () {};

  FileSecurity.prototype = {

    hasFolderSecurityTimeoutExceeded: function (dirEntry) {

      // if no pin set a security check is not necessary
      if (dirEntry.Pin === null || dirEntry.Pin === undefined || dirEntry.Pin === "") {
        return false;
      }

      // if the timeout is null then must check for pin
      var timeout = localStorage.getItem(dirEntry.name);
      if (timeout === null) {
        return true;
      }

      // return if timeout is within 10 hours per business rules
      return (((new Date(timeout).getTime() - new Date().getTime()) / 3600000) > 10);
    },

    setPinForTimeoutInLocalStorage: function (dirEntry) {
      localStorage.setItem(dirEntry.name, new Date().toLocaleString());
    }
  };
  return FileSecurity;
});
