window.FacturaModel = Backbone.NestedModel.extend({

    urlRoot:"api/facturi",

    validation:{

    },

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


function S4()
{
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid()
{
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function FacturaItem()
{
    this.guid = guid();
    this.item = '';
    this.um = '';
    this.qty = '1';
    this.pu = '0';

    this.vat = '24';

    this.subtotal = '0';
    this.total = '0';

    this.vatAmount = '0';
}
;

FacturaItem.prototype.calculate = function ()
{
    try
    {
        var vatPercent = parseFloat(this.vat) / 100;

        this.subtotal = Utils.roundToTwo(parseFloat(this.qty) * parseFloat(this.pu), 2);
        this.vatAmount = Utils.roundToTwo(this.subtotal * vatPercent, 2);
        this.total = this.subtotal + this.vatAmount;

        //console.log(this.subtotal, this.vatAmount, this.total, this.vat);
    }
    catch (e)
    {
    }
}

//window.ItemModel = Backbone.Model.extend({
//    defaults:{
//        cid: '-1',
//        item: '',
//        um: '',
//        qty: '1',
//        pu: '0',
//        subtotal: '0',
//        vat: '0',
//        total: '0'
//    },
//
//    initialize:function ()
//    {
//        console.log("ItemModel:initialize");
//        this.set('cid', Math.random().toString());
//
//        this.bind("change:qty change:pu", this.handleQtyPriceChange, this);
//    },
//
//    handleQtyPriceChange: function(e)
//    {
//        console.log("ItemModel:handleChange");
//
//        var subtotal = 0, vat = 0;
//
//        try
//        {
//            subtotal = Math.round(parseFloat(this.get('qty')) * parseFloat(this.get('pu')), 2);
//            vat = Math.round(subtotal * 0.24, 2);
//        }
//        catch(e)
//        {
//        }
//
//        this.set('subtotal', subtotal);
//        this.set('vat', vat);
//        this.set('total', subtotal + vat);
//
//        this.trigger('recalculate', this);
//    }
//})

window.FacturiCollection = Backbone.Collection.extend({

    model:FacturaModel,
    url:"api/facturi"
});


window.FacturiStatsCollection = Backbone.Collection.extend({
    url:"api/facturi/stats"
})