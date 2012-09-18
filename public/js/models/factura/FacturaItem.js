define(function ()
{
    var FacturaItem = function ()
    {
        this.item = '';
        this.um = '';
        this.qty = '1';
        this.pu = '0';

        this.vat = '24';

        this.subtotal = '0';
        this.total = '0';

        this.vatAmount = '0';

        this.guid = this.guidFunc();
    };

    FacturaItem.prototype.S4 = function ()
    {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };


    FacturaItem.prototype.guidFunc = function ()
    {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
    };

    FacturaItem.prototype.calculate = function ()
    {
        try
        {
            var vatPercent = parseFloat(this.vat) / 100;

            this.subtotal = (parseFloat(this.qty) * parseFloat(this.pu)).round(2);
            this.vatAmount = (this.subtotal * vatPercent).round(2);
            this.total = this.subtotal + this.vatAmount;
        }
        catch (e)
        {
            console.log(e);
        }
    };

    return FacturaItem;
});