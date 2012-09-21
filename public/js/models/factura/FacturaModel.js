define([
    'models/factura/FacturaItem',
    'jqueryUI'
],
    function (FacturaItem)
    {
        var FacturaModel = Backbone.NestedModel.extend({

            urlRoot:"api/facturi",

            defaults:{
                "docNo":"",
                "docDate":"",
                "docDueDate":"",

                nraviz:"",
                numeDelegat:"",
                ciSeria:"",
                ciNumar:"",
                cnp:"",
                detaliuTransport:"",
                expDate:"",
                note:"",

                client:{},
                items:[],

                subtotal:0,
                vat:0,
                total:0
            },

            initialize:function ()
            {
                console.log("FacturaModel:initialize");

                if (this.isNew())
                {
                    this.set("docNo", "");
                    this.set("docDate", $.datepicker.formatDate("dd/mm/yy", new Date()));
                    this.set("docDueDate", "");

                    this.set('items', []);
                    this.set('client', {});
                }
            },

            initNew:function ()
            {
                console.log("FacturaModel:initNew");

                // init empty client details
                var emptyClient = {};
                emptyClient.name = "";
                this.set({"client":emptyClient});
                this.client = emptyClient;

                // add two empty rows
                var emptyItems = [new FacturaItem(), new FacturaItem()];
                this.set({"items":emptyItems});
                this.items = emptyItems;
            },

            parse:function (response)
            {
                if (response != null)
                {
                    var items = new Array();

                    _.each(response.items, function (item)
                    {
                        var fi = new FacturaItem();
                        fi.id = item.id;
                        fi.item = item.item;
                        fi.um = item.um;
                        fi.qty = item.qty;
                        fi.pu = item.pu;

                        fi.vat = item.vat;
                        fi.vatAmount = item.vatAmount;
                        fi.subtotal = item.subtotal;
                        fi.total = item.total;

                        fi.calculate();

                        items.push(fi);
                    });

                    this.items = items;
                    this.client = response.client;
                }

                return response;
            },

            validation:{
                docNo:{
                    required:true
                }
            }

        });

        FacturaModel.duplicate = function (existingModel)
        {
            "use strict";

            var newModel = new FacturaModel();

            newModel.attributes = _.clone(existingModel.attributes);
            newModel.items = new Array();
            newModel.set({
                'docNo':'',
                'items':''
            });
            newModel.unset('id');

            for(var i in existingModel.items)
            {
                if (existingModel.items[i] instanceof FacturaItem)
                {
                    var newItem = new FacturaItem();
                    newItem.item = existingModel.items[i].item;
                    newItem.qty = existingModel.items[i].qty;
                    newItem.pu = existingModel.items[i].pu;
                    newItem.vat = existingModel.items[i].vat;
                    newItem.total = existingModel.items[i].total;
                    newItem.subtotal = existingModel.items[i].subtotal;
                    newItem.vatAmount = existingModel.items[i].vatAmount;

                    newModel.items.push(newItem);
                }
            }

            console.log(newModel);

            return newModel;
        }

        return FacturaModel;
    })