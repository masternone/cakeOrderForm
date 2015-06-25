;(function(angular) {

    'use strict';

    angular.module('cakeOrderForm', ['ngRoute', 'ngMessages', 'ngAnimate', 'ngMaterial'])
        .config(['$routeProvider', '$locationProvider', AppConfig])
        .controller('AppCtrl', ['$route', '$routeParams', '$location', AppCtrl])
        .controller('FormCtrl', ['$routeParams', 'StateFactory', 'CakeFlavors', 'FrostingFlavors', 'LayerSizes', FormCtrl])
        .controller('PrintCtrl', ['$routeParams', PrintCtrl])
        .factory('StateFactory', ['$http', StateFactory])
        .factory('CakeFlavors', CakeFlavors)
        .factory('FrostingFlavors', FrostingFlavors)
        .factory('LayerSizes',LayerSizes)
        .directive('payPalIcon', PayPalIcon)
        ;

    function PayPalIcon(){
        return {
            restrict: 'A',
            templateUrl: './partials/_paypal.html'
        }
    }

    function LayerSizes(){
        var LayerSizes = {};
        LayerSizes.getSizes = function(){
            return [
                {"name": "6 inch round", "cost": 10},
                {"name": "8 inch round", "cost": 14},
                {"name": "10 inch round", "cost": 16},
                {"name": "12 inch round", "cost": 18},
                {"name": "14 inch round", "cost": 20},
                {"name": "16 inch round", "cost": 22},
                {"name": "1/8 sheet", "cost": 10},
                {"name": "1/4 sheet", "cost": 15},
                {"name": "1/2 sheet", "cost": 20},
                {"name": "full sheet", "cost": 40},
            ]
        }
        return LayerSizes;
    }

    function CakeFlavors(){
        var CakeFlavors = {};
        CakeFlavors.getFlavors = function(){
            return [
                {"name": 'Choclate', "extra": 0},
                {"name": 'German Cholacte', "extra": 0},
                {"name": 'Red Velvet', "extra": 0},
                {"name": 'Yellow', "extra": 0},
                {"name": 'White', "extra": 0},
                {"name": 'Spice', "extra": 0},
                {"name": 'Carrot', "extra": 0}
            ]
        }
        return CakeFlavors;
    }
    
    function FrostingFlavors(){
        var FrostingFlavors = {};
        FrostingFlavors.getFlavors = function(){
            return [
                {"name": 'Buttercream', "extra": 0},
                {"name": 'Choclate Buttercream', "extra": 0},
                {"name": 'Wipped', "extra": 0},
                {"name": 'Choclate Wipped', "extra": 0},
                {"name": 'Creamcheese', "extra": 0}
            ]
        }
        return FrostingFlavors;
    }
    
    function StateFactory($http){
        var StateFactory = {}
        StateFactory.getStates = function(){
            return $http.get('./js/data/States.json')
        }
        return StateFactory;
    }

    function AppConfig($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './partials/_form.html',
                controller: 'FormCtrl',
                controllerAs: 'form'
            })
            .when('Form/:Form/det', {
                templateUrl: './partials/_printout.html',
                controller: 'PrintCtrl',
                controllerAs: 'print'
            })
            .otherwise({
                redirectTo: '/'
            });

        //$locationProvider.html5Mode(true);
    }

    function AppCtrl($route, $routeParams, $location) {
        //this.$route = $route;
        //this.$location = $location;
        //this.$routeParams = $routeParams;
    }

    function FormCtrl($routeParams, StateFactory, CakeFlavors, FrostingFlavors, LayerSizes) {
        //this.name = "FormCtrl";
        //this.params = $routeParams;
        this.layers = [];
        this.cakeFlavors = CakeFlavors.getFlavors();
        this.frostingFlavors = FrostingFlavors.getFlavors();
        this.layerSizes = LayerSizes.getSizes();
        var self = this;
        StateFactory.getStates()
            .success(function(States){
                console.log('States', States);
                self.states = States;
                self.state = 'MI'
            });
        this.addLayer = function(){
            
        }
    }

    function PrintCtrl($routeParams) {
        //this.name = "PrintCtrl";
        this.params = $routeParams;

    }
})(window.angular);