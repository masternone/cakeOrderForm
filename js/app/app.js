;
(function(angular){

    'use strict';

    var PHONENUM_REGEXP = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    var ZIPCODE_REGEXP = /^\d{5}(\-\d{4})?$/;

    angular.module('cakeOrderForm', ['ngRoute', 'ngMessages', 'ngAnimate'])
        .config(['$routeProvider', '$locationProvider', AppConfig])
        .controller('AppCtrl', ['$route', '$routeParams', '$location', AppCtrl])
        .controller('OrderFormCtrl', [
            'OrderFormData',
            'StateFactory',
            'CakeFlavors',
            'FrostingFlavors',
            'LayerSizes',
            OrderFormCtrl
        ])
        .controller('PrintCtrl', [
            'OrderFormData',
            'StateFactory',
            'CakeFlavors',
            'FrostingFlavors',
            'LayerSizes',
            PrintCtrl
        ])
        .factory('OrderFormData', OrderFormData)
        .factory('StateFactory', ['$http', StateFactory])
        .factory('CakeFlavors', CakeFlavors)
        .factory('FrostingFlavors', FrostingFlavors)
        .factory('LayerSizes', LayerSizes)
        .directive('phoneValid', phoneValid)
        .directive('zipcodeValid', zipcodeValid)
        .directive('payPalIcon', PayPalIcon)
    ;

    function PayPalIcon(){
        return {
            restrict: 'A',
            templateUrl: './partials/paypal.html'
        }
    }

    function zipcodeValid(){
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl){
                ctrl.$validators.zipcode = function(modelValue, viewValue){
                    if(ctrl.$isEmpty(modelValue)){
                        // consider empty models to be valid
                        return true;
                    }

                    if(ZIPCODE_REGEXP.test(viewValue)){
                        // it is valid
                        return true;
                    }

                    // it is invalid
                    return false;
                };
            }
        };
    }

    function phoneValid(){
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl){
                ctrl.$validators.phoneNum = function(modelValue, viewValue){
                    if(ctrl.$isEmpty(modelValue)){
                        // consider empty models to be valid
                        return true;
                    }

                    if(PHONENUM_REGEXP.test(viewValue.replace(/\D/g, ""))){
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
        var LayerSizes      = {};
        LayerSizes.getSizes = function(){
            return [
                {"id": 0, "name": "6 inch round", "cost": 10, "display": "$10.00"},
                {"id": 1, "name": "8 inch round", "cost": 14, "display": "$14.00"},
                {"id": 2, "name": "10 inch round", "cost": 16, "display": "$16.00"},
                {"id": 3, "name": "12 inch round", "cost": 18, "display": "$18.00"},
                {"id": 4, "name": "14 inch round", "cost": 20, "display": "$20.00"},
                {"id": 5, "name": "16 inch round", "cost": 22, "display": "$22.00"},
                {"id": 6, "name": "1/8 sheet", "cost": 10, "display": "$10.00"},
                {"id": 7, "name": "1/4 sheet", "cost": 15, "display": "$15.00"},
                {"id": 8, "name": "1/2 sheet", "cost": 20, "display": "$20.00"},
                {"id": 9, "name": "full sheet", "cost": 40, "display": "$40.00"}
            ]
        };
        return LayerSizes;
    }

    function CakeFlavors(){
        var CakeFlavors        = {};
        CakeFlavors.getFlavors = function(){
            return [
                {"id": 0, "name": 'Chocolate', "cost": 0, "display": "0%"},
                {"id": 1, "name": 'German Chocolate', "cost": 0, "display": "0%"},
                {"id": 2, "name": 'Red Velvet', "cost": 0, "display": "0%"},
                {"id": 3, "name": 'Yellow', "cost": 0, "display": "0%"},
                {"id": 4, "name": 'White', "cost": 0, "display": "0%"},
                {"id": 5, "name": 'Spice', "cost": 0, "display": "0%"},
                {"id": 6, "name": 'Carrot', "cost": 0, "display": "0%"}
            ]
        };
        return CakeFlavors;
    }

    function FrostingFlavors(){
        var FrostingFlavors        = {};
        FrostingFlavors.getFlavors = function(){
            return [
                {"id": 0, "name": 'Buttercream', "cost": 0, "display": "0%"},
                {"id": 1, "name": 'Chocolate Buttercream', "cost": 0, "display": "0%"},
                {"id": 2, "name": 'Whipped', "cost": 0, "display": "0%"},
                {"id": 3, "name": 'Chocolate Whipped', "cost": 0, "display": "0%"},
                {"id": 4, "name": "Cream Cheese", "cost": 0.25, "display": "25%"},
                {"id": 5, "name": "fondant", "cost": 1, "display": "100%"}
            ]
        };
        return FrostingFlavors;
    }

    function StateFactory($http){
        var StateFactory       = {};
        StateFactory.getStates = function(){
            return $http.get('./js/data/States.json')
        };
        return StateFactory;
    }

    function OrderFormData(){
        var layerItems   = ['size', 'cake', 'frosting'],
            trackedItems = [
                'firstName',
                'lastName',
                'email',
                'phoneNum',
                'addressOne',
                'addressTwo',
                'city',
                'state',
                'zipcode',
                'payment',
                'layers',
                'total'
            ],
            trackedItemsLength = trackedItems.length,
            data               = {};

        // This is only being used to speed up testing
        data.firstName  = 'Edward';
        data.lastName   = 'Grant';
        data.email      = 'themasternone@gmail.com';
        data.phoneNum   = '313.799.2101';
        data.addressOne = '18441 Delaware Ave';
        data.addressTwo = undefined;
        data.city       = 'RedFord';
        data.state      = 26;
        data.zipcode    = 48240;
        data.payment    = 'PayPal';
        data.layers     = [];

        var OrderFormData;
        OrderFormData = {
            save   : function(source){
                for(var i = 0; i < trackedItemsLength; i++){
                    data[trackedItems[i]] = source[trackedItems[i]]
                }
            },
            apply  : function(self){
                for(var i = 0; i < trackedItemsLength; i++){
                    self[trackedItems[i]] = data[trackedItems[i]]
                }
            },
            totalup: function(size, cake, frosting){
                data.total    = 0;
                this.size     = size;
                this.cake     = cake;
                this.frosting = frosting;
                for(var i = 0; i < data.layers.length; i++){
                    var currentLayer = data.layers[i];
                    for(var j = 0; j < layerItems.length; j++){
                        var currentLayerItem = layerItems[j];
                        switch(currentLayerItem){
                            case 'size':
                                // Size is the base price
                                data.total += this[currentLayerItem][currentLayer[currentLayerItem]].cost;
                                break;
                            case 'frosting':
                            case 'cake':
                                // These items are a percentage of the price of the layer's size
                                data.total +=
                                    this.size[currentLayer.size].cost * this[currentLayerItem][currentLayer[currentLayerItem]].cost;
                                break;
                            default :
                            //untracked key do nothing
                        }

                    }
                }
                return true;
            }
        };
        return OrderFormData;
    }

    function AppConfig($routeProvider, $locationProvider){
        $routeProvider
            .when('/', {
                templateUrl: './partials/form.html',
                controller : 'OrderFormCtrl',
                controllerAs: 'order'
            })
            .when('/print', {
                templateUrl: './partials/print.html',
                controller : 'PrintCtrl',
                controllerAs: 'print'
            })
            .otherwise({
                redirectTo: '/'
            });

        //$locationProvider.html5Mode(true);
    }

    function AppCtrl($route, $routeParams, $location){
        //this.$route = $route;
        //this.$location = $location;
        //this.$routeParams = $routeParams;
    }

    function OrderFormCtrl(OrderFormData, StateFactory, CakeFlavors, FrostingFlavors, LayerSizes){
        var vm             = this;
        vm.cakeFlavors     = CakeFlavors.getFlavors();
        vm.frostingFlavors = FrostingFlavors.getFlavors();
        vm.layerSizes      = LayerSizes.getSizes();
        StateFactory.getStates()
            .success(function(States){
                                 vm.states = States;
                                 if(!vm.state && vm.state !== 0)
                                     vm.state = 26;
                             });

        vm.save     = function(){
            OrderFormData.save(vm);
        };
        vm.addLayer = function(){
            vm.layers = vm.layers || [];
            vm.layers.push({
                cake    : '',
                frosting: '',
                size    : ''
            });
        };
        OrderFormData.apply(vm);
    }

    function PrintCtrl(OrderFormData, StateFactory, CakeFlavors, FrostingFlavors, LayerSizes){
        var vm        = this;
        vm.layerItems = ['size', 'cake', 'frosting'];
        vm.cake       = CakeFlavors.getFlavors();
        vm.frosting   = FrostingFlavors.getFlavors();
        vm.size       = LayerSizes.getSizes();
        vm.total      = 0;
        vm.isPayPal   = function(){
            return vm.payment == 'PayPal';
        };
        StateFactory.getStates()
            .success(function(States){
                                 vm.states = States;
                                 if(!vm.state && vm.state !== 0)
                                     vm.state = 26;
                             });
        OrderFormData.totalup(vm.size, vm.cake, vm.frosting);
        OrderFormData.apply(vm);
    }
})
(window.angular);