jQuery.sap.require("acceptpurchaseorder.view.utils.connectivity"); 
jQuery.sap.require("sap.m.MessageBox");	
sap.ui.define( ["sap/ui/core/mvc/Controller", "sap/ui/Device"], function (Controller, Device) {
	"use strict";

	return Controller.extend("acceptpurchaseorder.controller.Master", {
		onInit : function () {
			this.getOwnerComponent().getRouter().getRoute("master").attachPatternMatched(this._onRouteMatched, this);

			//Load OData Service
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
			sap.ui.getCore().setModel(oModel);

		
	
			
			//Get list control reference
			var list = this.getView().byId("list");
			
			//Frame Url with EntitySet
			var url = serviceUrl + "A_PurchaseOrder";
					
			//Call OdataService
			OData.read(url, function(data) {
	
				//Read output
				var result = data.results;
				
				//set JSONoutput to a JSONModel
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					listItems : result
				});
				
				//Set output to ListControl			
				list.setModel(oModel);
							
			}, function(err) {
				var errTxt = err.message + "\n" + err.request.requestUri;
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Service Error");
			});	
		},
		_onRouteMatched: function(oEvent) {
			/*
			* Navigate to the first item by default only on desktop and tablet (but not phone).
			* Note that item selection is not handled as it is
			* out of scope of this sample
			*/
			if (!Device.system.phone) {
				this.getOwnerComponent().getRouter()
					.navTo("orderDetails", {orderId: 0}, true);
			}
		},
		onSelectionChange: function(oEvent) {
			var sOrderId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("orderId");
			this.getOwnerComponent().getRouter()
				.navTo("orderDetails",
					{orderId:sOrderId},
					!Device.system.phone);
		}
	});

});

