jQuery.sap.require("acceptpurchaseorder.view.utils.connectivity"); 
jQuery.sap.require("sap.m.MessageBox");	
sap.ui.define( [
	"sap/ui/core/mvc/Controller",
	 "sap/ui/Device",
	  "sap/ui/model/json/JSONModel",
	   "sap/ui/model/Filter",
	    "sap/ui/model/FilterOperator",
		 'sap/ui/model/Sorter',], 
function (Controller, Device , JSONModel, Filter, Sorter, FilterOperator, GroupHeaderListItem,  Fragment, formatter) {
	"use strict";

	return Controller.extend("acceptpurchaseorder.controller.Master", {
		
		onInit : function () {
			this.getOwnerComponent().getRouter().getRoute("master").attachPatternMatched(this._onRouteMatched, this);

			//transfer to Odata
			var oModel = new sap.ui.model.json.JSONModel("/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder");
			this.getView().setModel(oModel, "user");
	
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
			//var sOrderId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("PurchaseOrder");
			//this.getOwnerComponent().getRouter().navTo("orderDetails", {orderId:sOrderId}, !Device.system.phone);
			var productPath = oEvent.getParameter("listItem").getBindingContext("user").getPath(),
				product = productPath.split("/").slice(-1).pop();

				this.getOwnerComponent().getRouter().navTo("orderDetails", { product: product});
		},


		onSearch: function (oEvent) {
			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				
				//if (sQuery.includes(".")){
				//	aFilter.push(new Filter("PurchaseOrderDate", sap.ui.model.FilterOperator.Contains, sQuery));

				//}else{
					aFilter.push(new Filter("PurchaseOrder", sap.ui.model.FilterOperator.Contains, sQuery));
				//}
			}

			// filter binding
			var oList = this.getView().byId("list");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

        },
	
		dateFormatter:function(meinDate){
			var date = new Date(parseInt(meinDate.substring(6,19) ));
			var day = date.getDate();
			var mon = date.getMonth()+1;
			var year = date.getFullYear();
			return day.toString() + '.' + mon.toString() + '.' + year.toString()  ;
			
		}

	});

});

