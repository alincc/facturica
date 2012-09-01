define(
    function ()
    {
        "use strict";

        var SerieModel = Backbone.Model.extend({
            urlRoot:"api/configSeries",

            url:function ()
            {
                if (this.isNew())
                {
                    return "api/configSeries";
                }
                else
                {
                    return "api/configSeries/" + this.id.toString();
                }
            },

            validation:{
                currentNumber:{
                    required:true,
                    min:0
                }
            },

            defaults:{
                docType:'FAC',
                prefix:'',
                suffix:'',
                currentNumber:'0'
            },

            getNextPossible:function ()
            {
                var me = this;

                var nextInt = parseInt(me.get('currentNumber')) + 1;

                return me.get('prefix') + nextInt.toString() + me.get('suffix');
            },

            getSample:function ()
            {
                var me = this;

                return me.get('prefix') + 'XXXX' + me.get('suffix');
            }
        });

        return SerieModel;
    });