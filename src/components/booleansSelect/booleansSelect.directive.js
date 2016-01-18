/**
 * apachesolrAngularjsSearch aasBooleansSelect directive.
 *
 */

(function () {
  'use strict';
  angular.module('apachesolrAngularjsSearch').directive('aasBooleansSelect', ['$rootScope', 'drupalDataService', booleansSelect]);

  function booleansSelect($rootScope, drupalDataService) {

    var basePath;
    $rootScope.$on('drupalDataReady', function() {
      var data = drupalDataService.getDrupalData();
      basePath = data.modulePath;
    });

    var directive = {
      // @TODO: Change hardcoded path.
      templateUrl: '/sites/all/modules/custom/apachesolr_angularjs_search' + '/src/components/booleansSelect/booleans-select.html',
      restrict: 'A',
      scope: {
        options: '=aasBooleansSelectOptions',
        selected: '=ngModel'
      },
      controller: BooleansSelectController,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;

    function BooleansSelectController() {
      var vm = this;
      vm.expanded = false;

      vm.selectItem = selectItem;

      function selectItem(item) {
        vm.selected = item;
        vm.expanded = false;
      }

    }
  }
})();
