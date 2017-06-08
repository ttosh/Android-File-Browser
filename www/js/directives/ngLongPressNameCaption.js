FileBrowserApp.directive('ngLongPressNameCaption', function ($timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $elm, $attrs) {
      $elm.bind('mousedown', function (evt) {
        $scope.longPress = true;
        $scope.click = true;

        // onLongPress: on-long-press
        $timeout(function () {
          $scope.click = false;
          if ($scope.longPress && $attrs.onLongPress) {
            $scope.$apply(function () {
              $scope.$eval($attrs.onLongPress, { $event: evt });
            });
          }
        }, $attrs.timeOut || 600); // timeOut: time-out

        // onTouch: on-touch
        if ($attrs.onTouch) {
          $scope.$apply(function () {
            $scope.$eval($attrs.onTouch, { $event: evt });
          });
        }
      });

      $elm.bind('mouseup', function (evt) {
        $scope.longPress = false;

        // onTouchEnd: on-touch-end
        if ($attrs.onTouchEnd) {
          $scope.$apply(function () {
            $scope.$eval($attrs.onTouchEnd, { $event: evt });
          });
        }

        // onClick: on-click
        if ($scope.click && $attrs.onClick) {
          $scope.$apply(function () {
            $scope.$eval($attrs.onClick, { $event: evt });
          });
        }
      });
    }
  };
})