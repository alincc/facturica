define(function(){

    var navigation = {
        update: function(newMenu)
        {
            console.log("Switching menu to ", newMenu)
            $("li a").parent().removeClass('active');
            $("a[href$=" + newMenu + "]", ".nav").parent().addClass('active');
        }
    }

    return navigation;

});