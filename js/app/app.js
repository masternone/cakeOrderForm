;
(function(angular){

    'use strict';

    var PHONENUM_REGEXP = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    var ZIPCODE_REGEXP = /^\d{5}(\-\d{4})?$/;

    angular.module('cakeOrderForm', ['ngRoute', 'ngMessages', 'ngAnimate', 'ngMaterial'])
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
                {"name": "6 inch round", "cost": 10},
                {"name": "8 inch round", "cost": 14},
                {"name": "10 inch round", "cost": 16},
                {"name": "12 inch round", "cost": 18},
                {"name": "14 inch round", "cost": 20},
                {"name": "16 inch round", "cost": 22},
                {"name": "1/8 sheet", "cost": 10},
                {"name": "1/4 sheet", "cost": 15},
                {"name": "1/2 sheet", "cost": 20},
                {"name": "full sheet", "cost": 40}
            ]
        };
        return LayerSizes;
    }

    function CakeFlavors(){
        var CakeFlavors        = {};
        CakeFlavors.getFlavors = function(){
            return [
                {"name": 'Chocolate', "cost": 0},
                {"name": 'German Chocolate', "cost": 0},
                {"name": 'Red Velvet', "cost": 0},
                {"name": 'Yellow', "cost": 0},
                {"name": 'White', "cost": 0},
                {"name": 'Spice', "cost": 0},
                {"name": 'Carrot', "cost": 0}
            ]
        };
        return CakeFlavors;
    }

    function FrostingFlavors(){
        var FrostingFlavors        = {};
        FrostingFlavors.getFlavors = function(){
            return [
                {"name": 'Buttercream', "cost": 0},
                {"name": 'Chocolate Buttercream', "cost": 0},
                {"name": 'Whipped', "cost": 0},
                {"name": 'Chocolate Whipped', "cost": 0},
                {"name": "Cream Cheese", "cost": 0.25}
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
                'layers'
            ],
            trackedItemsLength = trackedItems.length,
            data               = {};

        // This is only being used to speed up testing
        data.firstName  = 'Edward';
        data.lastName   = 'Grant';
        data.email      = 'themasternone@gmail.com';
        data.phoneNum    = '313.799.2101';
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
            totalup: function(){
                data.total = 0;
                console.log('inside totalup function');
                console.log('data.layers', data.layers);
                console.log('data.total', data.total);
                for(var i = 0; i < data.layers.length; i++){
                    console.log(data.layers[i]);
                    var currentLayer = data.layers[i];
                    for(var j = 0; j < layerItems.length; j++){
                        var currentLayerItem = layerItems[j];
                        console.log('currentLayer[currentLayerItem]', currentLayer[currentLayerItem]);
                        //console.log('this[currentLayerItem][currentLayer[currentLayerItem]].cost', this[currentLayerItem][currentLayer[currentLayerItem]].cost);
                        switch(currentLayerItem){
                            case 'size':
                                //console.log('in size adding to total', this[currentLayerItem][currentLayer[currentLayerItem]].cost);
                                //this.total += this[currentLayerItem][currentLayer[currentLayerItem]].cost;
                                //this.total += 2;
                                break;
                            case 'frosting':
                            case 'cake':
                                console.log('in ' + currentLayerItem);
                                //console.log('size', this.size[currentLayer.size].cost);
                                //console.log(currentLayerItem, this[currentLayerItem][currentLayer[currentLayerItem]].cost);
                                //console.log('adding', this.size[currentLayer.size].cost * this[currentLayerItem][currentLayer[currentLayerItem]].cost);
                                //this.total += this.size[currentLayer.size].cost * this[currentLayerItem][currentLayer[currentLayerItem]].cost;
                                break;
                            default :
                            //untracked key do nothing
                        }

                    }
                }
                return data.total;
                //return 7;
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
        //this.params = $routeParams;
        this.layers      = [];
        this.cakeFlavors = CakeFlavors.getFlavors();
        this.frostingFlavors = FrostingFlavors.getFlavors();
        this.layerSizes  = LayerSizes.getSizes();
        var self         = this;
        StateFactory.getStates()
            .success(function(States){
                                 self.states = States;
                                 if(!self.state && self.state !== 0)
                                     self.state = 26;
                             });

        this.save     = function(){
            OrderFormData.save(this);
        };
        this.addLayer = function(){
            this.layers.push({
                cake    : '',
                frosting: '',
                size    : ''
            });
        };
        OrderFormData.apply(this);
    }

    function PrintCtrl(OrderFormData, StateFactory, CakeFlavors, FrostingFlavors, LayerSizes){
        this.layerItems = ['size', 'cake', 'frosting'];
        this.cake       = CakeFlavors.getFlavors();
        this.frosting   = FrostingFlavors.getFlavors();
        this.size       = LayerSizes.getSizes();
        this.total      = 0;
        this.isPayPal   = function(){
            return this.payment == 'PayPal';
        };
        var self        = this;
        StateFactory.getStates()
            .success(function(States){
                                 self.states = States;
                                 if(!self.state && self.state !== 0)
                                     self.state = 26;
                             });
        OrderFormData.totalup();
        OrderFormData.apply(this);
    }
})
(window.angular);