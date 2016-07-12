angular.module("membermooseApp")
.filter('encodeURIComponent', function() {
    return window.encodeURIComponent;
});
