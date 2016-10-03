(function () {
'use strict';

angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com/menu_items.json")
  .directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      list: '<',
      onRemove: '&'
    }
  };
  return ddo;
}
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  menu.searchTerm = '';
  menu.found = [];

  //console.log("Size of found:" + menu.found);
  menu.getItems = function(searchTerm) {
    MenuSearchService.getMatchedMenuItems(menu.searchTerm)
    .then(function (response) {
      menu.found = response;
    }, function (response) {
      console.log("Error:" + error);
    });
  }
  menu.onRemove = function(itemIndex) {
    console.log("onRemove called");
    menu.found.splice(itemIndex, 1);
  }
}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({ method: "GET", url: ApiBasePath })
    .then(function (result) {
        var foundItems = result.data.menu_items;
        var returnedItems = [];

        // iterate over foundItems to get the one's that are needed
        for (var i in foundItems) {
          if (foundItems[i].description.indexOf(searchTerm) != -1)
            returnedItems.push(foundItems[i]);
        }
        return returnedItems;
    })
    .catch(function (error) {
      return null;
    })
  }
}

})();
