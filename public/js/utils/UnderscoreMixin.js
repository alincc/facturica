define(
        [
            'utils/NumberUtil'
        ],

        function()
        {
            _.mixin(
            {
                round:function(v, d)
                {
                    return v.round(v, d);
                }
            });

            _.mixin(
            {
                money:function(v)
                {
                    return v.money(2, ".", ",");
                }
            });
        });