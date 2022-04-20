sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("acceptpurchaseorder.controller.App", {
            onInit: function () {

            },
            onPress: function() {
                var oList = this.byId("list");
                oList.bindItems({
                    path: "/A_PurchaseOrderType",
                    
                    template: new ObjectListItem({
                        title: "{PurchaseOrder}"
                        
                    })
                });
            }
        });
    });


