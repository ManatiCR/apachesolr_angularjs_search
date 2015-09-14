angular
  .module('apachesolrAngularjsSearch')
  .directive('aasBooleansPopup', booleansPopup);

function booleansPopup($rootScope, drupalDataService) {

  var basePath;
  $rootScope.$on('drupalDataReady', function() {
    var data = drupalDataService.getDrupalData();
    basePath = data.modulePath;
  });

  var directive = {
    // @TODO: Change hardcoded path.
    templateUrl: 'sites/all/modules/custom/apachesolr_angularjs_search' + '/src-js/components/booleansPopup/booleans-popup.html',
    restrict: 'E',
    scope: {
      field: '='
    },
    controller: BooleansPopupController,
    controllerAs: 'vm',
    bindToController: true
  };
  return directive;

  function BooleansPopupController($scope) {
    var vm = this;

    vm.show = false;
    vm.textChange = textChange;
    vm.addBoolean = addBoolean;
    vm.firstBoolean = '';

    var target;
    var selectionStart;

    function textChange($event) {
      if ($event.charCode === 44) {
        vm.show = true;
        target = $event.target;
        selectionStart = target.selectionStart;
        angular.element(target).focus();
      }
      else {
        vm.show = false;
      }
      return true;
    }

    function addBoolean(operator, $event) {

      var addBooleanInField = true;
      vm.show = false;

      if (vm.field.id !== '__fulltext_search' && vm.firstBoolean && vm.firstBoolean !== operator) {
        addBooleanInField = false;
      }

      if (addBooleanInField) {

        if (!vm.firstBoolean) {
          vm.firstBoolean = operator;
        }

        var part = vm.field.value.substr(selectionStart + 1);
        vm.field.value = vm.field.value.substr(0, selectionStart);
        vm.field.value += ' ' + operator + ' ';
        vm.field.value += part;
        var selectionSum = operator.length + 2;
        var cursorPosition = selectionStart + selectionSum;
        angular.element(target).focus();
        setTimeout(function() {
          // Let's wait focus has finished before applying selectionRange.
          target.setSelectionRange(cursorPosition, cursorPosition);
        }, 0);
      }
      else {
        var part = vm.field.value.substr(selectionStart + 1);
        vm.field.value = vm.field.value.substr(0, selectionStart);
        vm.field.value += part;
        vm.field.nextConnector = operator.toLowerCase();
        $scope.$parent.main.addSameField($scope.$parent.groupIndex, $scope.$parent.$index);
        setTimeout(function() {
          angular.element(target).parents('.advanced-search--field-container').next().find('.advanced-search--field-value').focus();
        }, 0);
      }
    }
  }
}
