/**
 * apachesolrAngularjsSearch aasBooleansSelect directive.
 *
 */

(function () {
  'use strict';

  function booleansSelect($rootScope, drupalDataService) {

    var basePath;
    $rootScope.$on('drupalDataReady', function() {
      var data = drupalDataService.getDrupalData();
      basePath = data.modulePath;
    });

    function BooleansSelectController() {
      var vm = this;
      vm.expanded = false;

      function selectItem(item) {
        vm.selected = item;
        vm.expanded = false;
      }

      vm.selectItem = selectItem;

    }

    var directive = {
      // This path really doesn't matter because it's being replaced by
      // templatecache.
      templateUrl: '/apachesolr_angularjs_search' + '/src/components/booleansSelect/booleans-select.html',
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
  }

  angular.module('apachesolrAngularjsSearch').directive('aasBooleansSelect', ['$rootScope', 'drupalDataService', booleansSelect]);
})();
