sap.ui.define( ["sap/ui/core/mvc/Controller","sap/ui/core/routing/History", "sap/ui/Device"], function (Controller, History, Device) {
	"use strict";

	return Controller.extend("acceptpurchaseorder.controller.Detail", {
		onInit : function () {
			this.getOwnerComponent().getRouter().getRoute("orderDetails").attachPatternMatched(this._onRouteMatched, this);

			var oModel = new sap.ui.model.json.JSONModel("/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder");
			this.getView().setModel(oModel, "user");

			
		},
		
		_onRouteMatched: function(oEvent) {
			this._product = oEvent.getParameter("arguments").product;
			this.getView().bindElement( "user>/d/results/" + this._product);
			var order = this.get

			//https://S4H.OSOSOFT.DE:44300/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder('4500000001')/to_PurchaseOrderItem
			//this.getView().bindElement( "item>/d/results/" + this._product);
			var oModelItem = new sap.ui.model.json.JSONModel("/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder('"+ order +"')/to_PurchaseOrderItem");
			this.getView().setModel(oModelItem, "item");
		},
		onSelectionChange: function(oEvent) {
			var sProductId = oEvent.getSource().getBindingContext().getProperty("productId");
			this.getOwnerComponent().getRouter()
				.navTo("productDetails",
					{orderId:this._orderId, productId: sProductId});
		},
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			//The history contains a previous entry
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				// There is no history!
				// Naviate to master page
				this.getOwnerComponent().getRouter().navTo("master", {}, true);
			}
		}
	});

});
