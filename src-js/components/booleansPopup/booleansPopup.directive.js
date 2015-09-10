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

    var target;

    function textChange($event) {
      if ($event.charCode === 44) {
        vm.show = true;
        target = $event.target;
        angular.element(target).focus();
      }
      else {
        vm.show = false;
      }
      return true;
    }

    function addBoolean(operator, $event) {
      vm.field.value = vm.field.value.substr(0, vm.field.value.length - 1);
      vm.field.value += ' ' + operator + ' ';
      vm.show = false;
      angular.element(target).focus();
    }
  }
}
