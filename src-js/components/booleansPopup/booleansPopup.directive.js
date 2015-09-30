/**
 * apachesolrAngularjsSearch aasBooleansPopup directive.
 *
 */

(function () {
  'use strict';
  angular.module('apachesolrAngularjsSearch').directive('aasBooleansPopup', booleansPopup);

  function booleansPopup($rootScope, drupalDataService) {

    var basePath;
    $rootScope.$on('drupalDataReady', function() {
      var data = drupalDataService.getDrupalData();
      basePath = data.modulePath;
    });

    var directive = {
      // @TODO: Change hardcoded path.
      templateUrl: '/sites/all/modules/custom/apachesolr_angularjs_search' + '/src-js/components/booleansPopup/booleans-popup.html',
      restrict: 'A',
      scope: {
        field: '='
      },
      controller: BooleansPopupController,
      controllerAs: 'vm',
      bindToController: true,
      link: BooleansPopupLink
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

        var part;
        if (addBooleanInField) {

          if (!vm.firstBoolean) {
            vm.firstBoolean = operator;
          }

          if (vm.type === 'autocomplete') {
            var length = vm.field.value.length;
            vm.field.value.push({id: operator + '-' + length, name: operator, class:'advanced-search--field-autocomplete-operator'});
          }
          else {
            part = vm.field.value.substr(selectionStart + 1);
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
          if (!vm.field.autocompletePath) {
            setTimeout(function() {
              jQuery($scope.element).find('textarea, input').data('highlighter').highlight();
            }, 0);
          }
        }
        else {
          if (vm.type !== 'autocomplete') {
            part = vm.field.value.substr(selectionStart + 1);
            vm.field.value = vm.field.value.substr(0, selectionStart);
            vm.field.value += part;
          }
          $scope.$parent.main.addSameField($scope.$parent.groupIndex, $scope.$parent.$index);
          $scope.$parent.main.groups[$scope.$parent.groupIndex].fields[$scope.$parent.$index + 1].previousConnector = operator.toLowerCase();
          if (target) {
            setTimeout(function() {
              //    angular.element(target).parents('.advanced-search--field-container').next().find('.advanced-search--field-value').focus();
            }, 0);
          }
        }
      }

      function separateFieldValue(field, booleanToSeparate) {
        var newFieldValue = field.value.substr(field.value.indexOf(booleanToSeparate) + booleanToSeparate.length, field.value.length - 1).trim();
        field.value = field.value.substr(0, field.value.indexOf(booleanToSeparate));
        $scope.$parent.main.addSameField($scope.$parent.groupIndex, $scope.$parent.$index);
        $scope.$parent.main.groups[$scope.$parent.groupIndex].fields[$scope.$parent.$index + 1].previousConnector = booleanToSeparate;
        $scope.$parent.main.groups[$scope.$parent.groupIndex].fields[$scope.$parent.$index + 1].value = newFieldValue;
        return newFieldValue;
      }

      function verifyFieldValue(field, matches) {
        if (matches.length) {
          var firstMatch = matches[0];
          for (var index = 1; index < matches.length; index++) {
            if (matches[index] !== firstMatch) {
              var newFieldValue = separateFieldValue(field, matches[index]);
              var regex = new RegExp('(AND|OR|NOT)');
              var newFieldMatches = newFieldValue.match(regex);
              if (newFieldMatches !== null) {
                // Add matches.
                verifyFieldValue($scope.$parent.main.groups[$scope.$parent.groupIndex].fields[$scope.$parent.$index + 1], newFieldMatches);
              }
              break;
            }
          }
        }
      }

      function highlightChange($event) {
        var $markers = $event.matches;
        if ($markers.length) {

          if (vm.field.id !== '__fulltext_search') {
            verifyFieldValue(vm.field, $markers);
            jQuery($event.target).data('highlighter').highlight();
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

    function BooleansPopupLink(scope, element) {

      function setHighlight() {
        jQuery(element).find('.form-textarea, .form-text').highlightTextarea({
          words: ['AND', 'OR', 'NOT'],
          color: '#CCC'
        });

        jQuery(element).bind('matchesChanged', scope.vm.highlightChange);

        scope.element = element;
      }

      setTimeout(setHighlight, 0);
    }
  }
})();
