define([
    'models/factura/FacturaItem',
    'jqueryUI'
],
    function (FacturaItem)
    {
        var Factura = Backbone.Model.extend({

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
                note:""
            },

            initialize:function ()
            {
                console.log("FacturaModel:initialize");

                if (this.isNew())
                {
                    this.set("docNo", "");
                    this.set("docDate", $.datepicker.formatDate("dd/mm/yy", new Date()));
                    this.set("docDueDate", "");
                }
            },

            initNew:function ()
            {
                console.log("FacturaModel:initNew");

                // init empty client details
                var emptyClient = {};
                emptyClient.name = "";
                this.set("client", emptyClient);
                this.client = emptyClient;

                // add two empty rows
                var emptyItems = [new FacturaItem(), new FacturaItem()];
                this.set("items", emptyItems);
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
            }
        });

        return Factura;
    })