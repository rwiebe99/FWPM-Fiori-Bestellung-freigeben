jQuery.sap.require("acceptpurchaseorder.view.utils.connectivity"); 
jQuery.sap.require("sap.m.MessageBox");	
sap.ui.define( [
	"sap/ui/core/mvc/Controller",
	 "sap/ui/Device",
	  "sap/ui/model/json/JSONModel",
	   "sap/ui/model/Filter",
	    "sap/ui/model/FilterOperator",
		"sap/ui/core/Fragment",
		 'sap/ui/model/Sorter',], 
function (Controller, Device , JSONModel, Filter, Sorter, FilterOperator, GroupHeaderListItem,  Fragment , formatter) {
	"use strict";

	return Controller.extend("acceptpurchaseorder.controller.Master", {
		
		onInit : function () {
			this.getOwnerComponent().getRouter().getRoute("master").attachPatternMatched(this._onRouteMatched, this);

			//transfer to Odata
			var oModel = new sap.ui.model.json.JSONModel("/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder");
			this.getView().setModel(oModel, "user");
	
			this._mDialogs = {};
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
			
		},
		
		// Opens View Settings Dialog
		handleOpenDialog: function () {
			this._openDialog("Dialog");
		},

		_openDialog : function (sName, sPage, fInit) {
			var oView = this.getView();

			// creates requested dialog if not yet created
			if (!this._mDialogs[sName]) {
				this._mDialogs[sName] = sap.ui.core.Fragment.load({
					id: oView.getId(),
					name: "acceptpurchaseorder.view." + sName,
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					if (fInit) {
						fInit(oDialog);
					}
					return oDialog;
				});
			}
			this._mDialogs[sName].then(function(oDialog){
				// opens the requested dialog
				oDialog.open(sPage);
			});
		},

		handleConfirm: function (oEvent) {
			this._applySortGroup(oEvent);
		},

		_applySortGroup: function (oEvent) {
            var params = oEvent.getParameters(),
                path,
                desc,
				path1,
                desc1,
                sorter = [],
				filter = [];
            path = params.sortItem.getKey();
            desc = params.sortDescending;
			path1 = params.filterItems[0].mProperties.key ;
            
            sorter.push(new sap.ui.model.Sorter(path, desc));
			filter.push(new sap.ui.model.Filter('PurchasingDocumentDeletionCode',sap.ui.model.FilterOperator.Contains, path1));
            this.byId("list").getBinding("items").sort(sorter);
			var oList = this.getView().byId("list");
			var oBinding = oList.getBinding("items");
			oBinding.filter(filter);
        }
	});
});

