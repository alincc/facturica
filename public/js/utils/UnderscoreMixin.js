define(
    [
        'utils/NumberUtil'
    ],

    function ()
    {

        _.mixin(
            {
                round:function (v, d)
                {
                    if (v)
                    {
                        return v.round(v, d);
                    }
                    else
                    {
                        return v;
                    }
                },

                money:function (v)
                {
                    if (v)
                    {
                        return v.money(2, ".", ",");
                    }
                    else
                    {
                        return "0.00";
                    }
                }
            }
        );
    })
;