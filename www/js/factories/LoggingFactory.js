FileBrowserApp.factory("$loggingFactory", function () {

  var Logger = function () {};

  Logger.prototype = {

    logMessageToConsole: function (message) {
      console.log('-----------------------------------------------------');
      console.log(message);
      console.log('-----------------------------------------------------');
      console.log('\n');
    },

    logMessageAndObjectToConsole: function (message, obj) {
      console.log('-----------------------------------------------------');
      console.log(obj);
      console.log(message);
      console.log('-----------------------------------------------------');
      console.log('\n');
    },

    logMessageAndErrorToConsole: function(message, err) {
      console.log('-----------------------------------------------------');
      console.log(err);
      console.log(message);
      console.log('-----------------------------------------------------');
      console.log('\n');
    }
  };

  return Logger;
});
