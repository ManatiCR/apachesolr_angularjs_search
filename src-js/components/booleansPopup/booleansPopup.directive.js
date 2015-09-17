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

    vm.parentScope = $scope.$parent;
    vm.booleansPopup = vm.parentScope.main.booleansPopup = {show: false};
    vm.textChange = textChange;
    vm.addBoolean = addBoolean;
    vm.highlightChange = highlightChange;
    vm.optionSelected = optionSelected;
    vm.format = {
      '#619FFF': /\sAND|\sOR|\sNOT/g
    };
    vm.firstBoolean = '';

    var target;
    var selectionStart;

    if (!vm.field.value) {
      // Prevent error with hightlight.
      vm.field.value = '';
    }

    function textChange($event) {
      if (!target) {
        target = $event.target;
      }

      if ($event.charCode === 44) {
        vm.booleansPopup.show = true;
        selectionStart = target.selectionStart;
        target.focus();
      }
      else {
        vm.booleansPopup.show = false;
      }
      return true;
    }

    function addBoolean(operator) {

      var addBooleanInField = true;
      vm.booleansPopup.show = false;

      if (vm.field.id !== '__fulltext_search' && vm.firstBoolean && vm.firstBoolean !== operator) {
        addBooleanInField = false;
      }

      if (addBooleanInField) {

        if (!vm.firstBoolean) {
          vm.firstBoolean = operator;
        }

        if (vm.type === 'autocomplete') {
          vm.field.value.push({id: operator, name: operator, class:'advanced-search--field-autocomplete-operator'});
        }
        else {
          var part = vm.field.value.substr(selectionStart + 1);
          vm.field.value = vm.field.value.substr(0, selectionStart);
          vm.field.value += ' ' + operator + ' ';
          vm.field.value += part;
        }
        var selectionSum = operator.length + 2;
        var cursorPosition = selectionStart + selectionSum;
        if (target) {
          target.focus();
          setTimeout(function() {
            // Let's wait focus has finished before applying selectionRange.
            target.setSelectionRange(cursorPosition, cursorPosition);
          }, 0);
        }
      }
      else {
        if (vm.type !== 'autocomplete') {
          var part = vm.field.value.substr(selectionStart + 1);
          vm.field.value = vm.field.value.substr(0, selectionStart);
          vm.field.value += part;
        }
        vm.field.nextConnector = operator.toLowerCase();
        $scope.$parent.main.addSameField($scope.$parent.groupIndex, $scope.$parent.$index);
        if (target) {
          setTimeout(function() {
            angular.element(target).parents('.advanced-search--field-container').next().find('.advanced-search--field-value').focus();
          }, 0);
        }
      }
    }

    function highlightChange($markers) {
      var lastInserted = {};
      // @TODO: Fix random behaviors when boolean is not inserted at end.
      if ($markers.length) {
        lastInserted = $markers[$markers.length - 1];
        if (!vm.firstBoolean) {
          vm.firstBoolean = lastInserted.text;
        }

        if (vm.field.id !== '__fulltext_search' && vm.firstBoolean !== lastInserted.text) {
          vm.field.value = vm.field.value.substr(0, vm.field.value.length - 3);
          vm.field.nextConnector = lastInserted.text.toLowerCase().trim();
          $scope.$parent.main.addSameField($scope.$parent.groupIndex, $scope.$parent.$index);
          setTimeout(function() {
            angular.element(target).parents('.advanced-search--field-container').next().find('.advanced-search--field-value').focus();
          }, 0);
        }
      }
      else {
        vm.firstBoolean = '';
      }
    }

    function optionSelected() {
      if (vm.field.value) {
        vm.booleansPopup.show = true;
        vm.type = 'autocomplete';
        angular.element(document.getElementsByClassName('ui-select-search')).on('keydown', hideBooleansPopup);
      }
      else {
        vm.booleansPopup.show = true;
      }
    }

    function hideBooleansPopup() {
      vm.booleansPopup.show = false;
      angular.element(document.getElementsByClassName('ui-select-search')).unbind('keydown', hideBooleansPopup);
    }

  }
}
