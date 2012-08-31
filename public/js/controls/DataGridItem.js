define(
        [
                'libs/jquery.exptextarea'
        ],
        function()
        {
            var DataGridItem = Backbone.View.extend({

                tagName:"tr",

                events: {
                    "change input,textarea": "attributesChanged"
                },

                disabled: false,

                initialize: function ()
                {
                    console.log("DataGridItem:initialize");

                    var me = this;
                    _.bindAll(me, 'render');

                    // Options
                    me.disabled = me.options.disabled;
                    me.rowUpdateHandler = me.options.rowUpdateHandler;
                    me.itemRenderer = me.options.itemRenderer;
                    me.scope = me.options.scope;
                    // Render row
                    me.template = _.template(me.itemRenderer);
                },

                render: function ()
                {
                    console.log("DataGridItem:render");

                    var me = this;
                    var el = $(me.el);

                    el.html(me.template(me.model));

                    // Hide actions
                    $("td.action-buttons a", el).hide();
                    // Auto expand text area
                    $('textarea.expand', el).expandingTextArea();

                    if (!me.disabled)
                    {
                        // Handle mouse over and mouse out for this row
                        el.mouseover(me.handleRowFocus).mouseout(me.handleRowLostFocus);

                        // Change background color if focus
                        $("td input[type!=hidden],textarea", el)
                                .focus(me.handleFocus)
                                .blur(me.handleLostFocus);

                        // Validate numeric input
                        $("input.numeric", el).keyup(me.validateNumber);
                    }
                    else
                    {
                        el.find("input,textarea").attr("readonly", true);
                    }

                    return me;
                },

                attributesChanged: function(e)
                {
                    console.log("DataGridItem:attributesChanged");

                    var target = $(e.currentTarget);
                    var attr = target.attr('name');

                    if (this.rowUpdateHandler)
                    {
                        this.rowUpdateHandler(this.scope, "rowUpdate", this.model, attr, target.val());
                    }
                },

                handleFocus: function()
                {
                    $(this).closest("td").addClass("cell-active");
                },

                handleLostFocus: function()
                {
                    $(this).closest("td").removeClass("cell-active")
                },

                handleRowFocus: function()
                {
                    $("td.action-buttons a", this).show();
                },

                handleRowLostFocus: function()
                {
                    $("td.action-buttons a", this).hide();
                },

                validateNumber: function (e)
                {
                    //var reg = /^-{0,1}\d*\.{0,1}\d+$/;
                    if (isNaN(this.value))
                    {
                        this.value = this.value.replace(/[^\-0-9\.]/g, '');
                        if (this.value === "")
                        {
                            this.value = "0";
                            //$(this).select();
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });

            return DataGridItem;
        })