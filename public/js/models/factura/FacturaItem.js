define(function ()
{
    var FacturaItem = function ()
    {
    };

    FacturaItem.prototype.guid = function ()
    {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    FacturaItem.prototype.S4 = function ()
    {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    FacturaItem.prototype = function ()
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

    FacturaItem.prototype.calculate = function ()
    {
        try
        {
            var vatPercent = parseFloat(this.vat) / 100;

            this.subtotal = Utils.roundToTwo(parseFloat(this.qty) * parseFloat(this.pu), 2);
            this.vatAmount = Utils.roundToTwo(this.subtotal * vatPercent, 2);
            this.total = this.subtotal + this.vatAmount;
        }
        catch (e)
        {
        }
    }

    return FacturaItem;
})