'use strict';

function table() {
  return {
    bindings: {
      tableData: '<'
    },
    templateUrl: 'table.html',
    controllerAs: 'tableC',
    controller: tableController
  };
}

function tableController($log) {
  /* jshint validthis: true */
  var vm = this;
  var totalWidth = 100;
  var minWidth = 7;
  var maxWidth = 45;

  // vm variables
  vm.chartsParams = {};
  vm.widthTableCell = [];
  vm.errorTable = false;
  vm.errorBrand = false;

  // vm functions

  $log.debug('reportTable');

  vm.$onInit = function () {
    angular.isDefined(vm.tableData) &&
      angular.isDefined(vm.tableData.thLabel) &&
      angular.isDefined(vm.tableData.tdData) ? manageWidthTable() : vm.errorTable = true;
  };

  /**
   * @name manageWidthTable
   * @description manages the width of table cells. use the length of the content
   * @return {null}
   */
  function manageWidthTable() {
    if (vm.tableData.tdData.length !== 0) {
      addWidthTable(vm.tableData.thLabel, vm.tableData.tdData);
      while (_.sumBy(vm.widthTableCell) > totalWidth) {
        _.forEach(vm.widthTableCell, subtractWidth);
      }
      totalWidth - _.sumBy(vm.widthTableCell) !== 0 && correctTotalWidth();
    } else {
      vm.errorBrand = true;
    }
  }

  function subtractWidth(width, index) {
    vm.widthTableCell[index] = width > minWidth ? width - 1 : width;
  }

  function addWidthTable(arrayLabel, arrayData) {
    addWidthArray(arrayLabel, true);
    _.forEach(arrayData, function (data) {
      addWidthArray(data, false);
    });
  }

  function addWidthArray(array, isLabel) {
    _.forEach(array, function (value, index) {
      if (angular.isDefined(value)) {
        isLabel ? vm.widthTableCell.push(value.length) : vm.widthTableCell[index] < value.length && (vm.widthTableCell[index] = value.length);
        vm.widthTableCell[index] < minWidth && (vm.widthTableCell[index] = minWidth);
        vm.widthTableCell[index] > maxWidth && (vm.widthTableCell[index] = maxWidth);
      } else {
        vm.errorTable = true;
      }
    });
  }

  function correctTotalWidth() {
    var difference = totalWidth - _.sumBy(vm.widthTableCell);
    while (difference !== 0) {
      _.forEach(vm.widthTableCell, correctWidth);
    }

    function correctWidth(width, index) {
      if (difference !== 0) {
        vm.widthTableCell[index] = width + 1;
        difference -= 1;
      }
    }
  }
}
tableController.$inject = ['$log'];

angular.module('angularTable', [])
  .component('angularTable', table());

angular.module('angularTable').run(['$templateCache', function($templateCache) {$templateCache.put('table.html','<div class="table-container">\n  <div class="table" ng-hide="tableC.errorTable || tableC.errorBrand" style="border: 1px solid black; display: flex; flex-direction: column;">\n      <div class="thead" style="color: white; display: flex; flex-direction: column; font-weight: normal; text-align: center;">\n          <div class="tr" style="display: flex; flex-direction: row; justify-content: center;">\n              <div ng-repeat="item in tableC.tableData.thLabel" ng-style="{width: tableC.widthTableCell[$index] + \'%\'}" class="th" style="align-items: center; background-color: black; border: 1px solid black; border-left: 1px solid black; border-right: 1px solid black; display: flex; flex-direction: row; flex-wrap: wrap; font-weight: normal !important; justify-content: center;">\n                  <span style="margin: 0 5px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize;">{{item}}</span>\n              </div>\n          </div>\n      </div>\n      <div class="wrap" ng-class="{\'wrap-report\': tableC.report}" style="-webkit-overflow-scrolling: touch; max-height: 53vh; overflow-y: overlay;">\n          <div class="tbody" style="display: flex; flex-direction: column;">\n              <div class="tr" ng-repeat="row in tableC.tableData.tdData" style="display: flex; flex-direction: row;">\n                  <div ng-repeat="item in row track by $index" ng-style="{width: tableC.widthTableCell[$index] + \'%\'}" class="td" style="align-items: center; border: 1px solid black; display: flex; flex-direction: row; justify-content: center; min-height: 35px; position: relative; text-align: center;">\n                      <p>{{item}}</p>\n                  </div>\n              </div>\n          </div>\n      </div>\n  </div>\n</div>\n');}]);