/*sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "acceptpurchaseorder/model/models",
	    "acceptpurchaseorder/controller/ListSelector",
    ],
    function (UIComponent, Device, models, ListSelector) {
        "use strict";

        return UIComponent.extend("acceptpurchaseorder.Component", {
            metadata: {
                manifest: "json"
            },

           
            init: function () {
                this.oListSelector = new ListSelector();

                this.setModel(models.createFLPModel(), "FLP");

                // set the dataSource model
                this.setModel(new sap.ui.model.json.JSONModel({}), "dataSource");
    
                // set application model
                var oApplicationModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oApplicationModel, "applicationModel");
    
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },
            destroy: function() {
                this.oListSelector.destroy();
                // call the base component's destroy function
                UIComponent.prototype.destroy.apply(this, arguments);
            },
            getContentDensityClass: function() {
                if (this._sContentDensityClass === undefined) {
                    // check whether FLP has already set the content density class; do nothing in this case
                    if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
                        this._sContentDensityClass = "";
                    } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                        this._sContentDensityClass = "sapUiSizeCompact";
                    } else {
                        // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                        this._sContentDensityClass = "sapUiSizeCozy";
                    }
                }
                return this._sContentDensityClass;
            },

		getNavigationPropertyForNavigationWithContext: function(sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}
        });
        
    }
);*/

sap.ui.define( ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "sap/ui/Device"], function (UIComponent, JSONModel, Device) {
	"use strict";
	return UIComponent.extend("acceptpurchaseorder.Component", {

		metadata: {
			manifest: "json"
		},

		init : function () {

			var oModel = new JSONModel("/controller/data.json");
			this.setModel(oModel);
			this.setModel(this.createDeviceModel(), "device");

			UIComponent.prototype.init.apply(this, arguments);

			// Parse the current url and display the targets of the route that matches the hash
			this.getRouter().initialize();

			this.getRouter().attachTitleChanged(function(oEvent){
				// set the browser page title based on selected order/product
				document.title = oEvent.getParameter("title");
			});
		},
		createDeviceModel : function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}

	});
});
