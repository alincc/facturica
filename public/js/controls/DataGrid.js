define(
    [
        'controls/DataGridItem',
        'models/factura/FacturaItem'
    ],
    function (DataGridItem, FacturaItem) // !!! remove FacturaItem
    {
        var DataGrid = Backbone.View.extend({
            events:{
                "click .add-line":"addLine",
                "click .delete-line":"removeLine"
            },

            initialize:function ()
            {
                console.log('DataGrid:initialize');
            },

            render:function ()
            {
                console.log('DataGrid:render');

                var me = this;
                var el = $(this.el);
                el.empty();

                me.disabled = me.options.disabled;
                me.rowAddHandler = me.options.rowAddHandler;
                me.rowRemoveHandler = me.options.rowRemoveHandler;
                me.rowUpdateHandler = me.options.rowUpdateHandler;
                me.itemRenderer = me.options.itemRenderer;
                me.scope = me.options.scope;

                me.rows = new Array();

                // Render items
                _.each(this.model, function (item)
                {
                    var gridItem = new DataGridItem({
                        model:item,
                        disabled:me.disabled,
                        rowUpdateHandler:me.rowUpdateHandler,
                        itemRenderer:me.itemRenderer,
                        scope:me.scope
                    });

                    me.rows.push(gridItem);

                    el.append(gridItem.render().el);
                });

                return this;
            },

            addLine:function (e)
            {
                e.preventDefault();

                console.log('DataGrid:addLine');

                // Update model
                var newItem = new FacturaItem();
                this.model.push(newItem);

                // Render row
                var rowItem = new DataGridItem({
                    model:newItem,
                    rowUpdateHandler:this.rowUpdateHandler,
                    itemRenderer:this.itemRenderer,
                    scope:this.scope
                });
                this.rows.push(rowItem);
                $(this.el).append(rowItem.render().el);

                if (this.rowAddHandler)
                {
                    this.rowAddHandler(this.scope);
                }
            },

            removeLine:function (e)
            {
                var isRemoved = false, guid;
                e.preventDefault();

                console.log('DataGrid:removeLine');

                // Find model by cid
                guid = this.$(e.currentTarget).closest(".action-buttons").attr('data-cid');
                if (!guid)
                {
                    throw "Could not retrive data-cid";
                }

                // Remove item from array
                for (var i = 0;i < this.model.length;i++)
                {
                    if (this.model[i].guid === guid)
                    {
                        // Remove row
                        this.model.splice(i, 1);

                        // Close view
                        this.rows[i].close();
                        this.rows.splice(i, 1);
                        isRemoved = true;
                        break;
                    }
                }

                if (isRemoved)
                {
                    // Remove table row
                    $(e.currentTarget).closest("tr").remove();

                    if (this.rowRemoveHandler)
                    {
                        this.rowRemoveHandler(this.scope);
                    }
                }
            }
        });

        return DataGrid;
    });