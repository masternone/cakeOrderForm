;(function(angular) {

    'use strict';

    var ZIPCODE_REGEXP = /^\d{5}(\-\d{4})?$/;

    angular.module('cakeOrderForm', ['ngRoute', 'ngMessages', 'ngAnimate', 'ngMaterial'])
        .config(['$routeProvider', '$locationProvider', AppConfig])
        .controller('AppCtrl', ['$route', '$routeParams', '$location', AppCtrl])
        .controller('OrderFormCtrl', ['$routeParams', 'OrderFormData','StateFactory', 'CakeFlavors', 'FrostingFlavors', 'LayerSizes', OrderFormCtrl])
        .controller('PrintCtrl', ['$routeParams','OrderFormData', PrintCtrl])
        .factory('OrderFormData', OrderFormData)
        .factory('StateFactory', ['$http', StateFactory])
        .factory('CakeFlavors', CakeFlavors)
        .factory('FrostingFlavors', FrostingFlavors)
        .factory('LayerSizes',LayerSizes)
        .directive('zipcodeValid', zipcodeValid)
        .directive('payPalIcon', PayPalIcon)
        ;

    function PayPalIcon(){
        return {
            restrict: 'A',
            templateUrl: './partials/paypal.html'
        }
    }

    function zipcodeValid() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.zipcode = function(modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                      // consider empty models to be valid
                      return true;
                    }
    
                    if(ZIPCODE_REGEXP.test(viewValue)) {
                      // it is valid
                      return true;
                    }
            
                    // it is invalid
                    return false;
                };
            }
        };
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

    function OrderFormData(){
        var data = {};
        var OrderFormData = {
            getFirstName  : function(){ return data.firstName; },
            setFirstName  : function(firstName){ data.firstName = firstName; },
            getLastName   : function(){ return data.lastName; },
            setLastName   : function(lastName){ data.lastName = lastName; },
            getEmail      : function(){ return data.email; },
            setEmail      : function(email){ data.lastName = email; },
            getAddressOne : function(){ return data.addressOne; },
            setAddressOne : function(addressOne){ data.addressOne = addressOne; },
            getAddressTwo : function(){ return data.addressTwo; },
            setAddressTwo : function(addressTwo){ data.addressTwo = addressTwo; },
            getCity       : function(){ return data.city; },
            setCity       : function(city){ data.city = city; },
            getState      : function(){ return data.state; },
            setState      : function(state){ data.state = state; },
            getZipcode    : function(){ return data.zipcode; },
            setZipcode    : function(zipcode){ data.zipcode = zipcode; }
        }
        return OrderFormData;
    }

    function AppConfig($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './partials/form.html',
                controller: 'OrderFormCtrl',
                controllerAs: 'order'
            })
            .when('/print', {
                templateUrl: './partials/print.html',
                controller: 'PrintCtrl',
                controllerAs: 'print'
            })
            .otherwise({
                redirectTo: '/'
            });

        //$locationProvider.html5Mode(true);
    }

    function AppCtrl($route, $routeParams, $location, $mdThemingProvider) {
        //this.$route = $route;
        //this.$location = $location;
        //this.$routeParams = $routeParams;
    }

    function OrderFormCtrl($routeParams, OrderFormData, StateFactory, CakeFlavors, FrostingFlavors, LayerSizes) {
        //this.params = $routeParams;
        this.layers = [];
        this.cakeFlavors = CakeFlavors.getFlavors();
        this.frostingFlavors = FrostingFlavors.getFlavors();
        this.layerSizes = LayerSizes.getSizes();
        var self = this;
        StateFactory.getStates()
            .success(function(States){
                self.states = States;
                self.state = 'MI'
            });
        this.setFirstName = function(){ OrderFormData.setFirstName(this.firstName); }
        this.setLastName = function(){ OrderFormData.setLastName(this.lastName); }
        this.setEmail = function(){ OrderFormData.setEmail(this.email); }
        this.setAddressOne = function(){ OrderFormData.setAddressOne(this.addressOne); }
        this.setAddressTwo = function(){ OrderFormData.setAddressTwo(this.addressTwo); }
        this.setCity = function(){ OrderFormData.setCity(this.city); }
        this.setState = function(){ OrderFormData.setState(this.state); }
        this.setZipcode = function(){ OrderFormData.setZipcode(this.zipcode); }
        this.addLayer = function(){
            
        }
    }

    function PrintCtrl($routeParams, OrderFormData) {
        //this.params = $routeParams;
        this.firstName  = OrderFormData.getFirstName();
        this.lastName   = OrderFormData.getLastName();
        this.email      = OrderFormData.getEmail();
        this.addressOne = OrderFormData.getAddressOne();
        this.addressTwo = OrderFormData.getAddressTwo();
        this.city       = OrderFormData.getCity();
        this.state      = OrderFormData.getState();
        this.zipcode    = OrderFormData.getZipcode();
    }
})(window.angular);