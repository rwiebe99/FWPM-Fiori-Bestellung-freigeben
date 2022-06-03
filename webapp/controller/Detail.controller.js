sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/Device"], function (Controller, History, Device, formatter) {
	"use strict";
	var oModelItem;
	var loaded = false;
	return Controller.extend("acceptpurchaseorder.controller.Detail", {
		
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("orderDetails").attachPatternMatched(this._onRouteMatched, this);

			var oModel = new sap.ui.model.json.JSONModel("/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder");
			this.getView().setModel(oModel, "user1");
			oModelItem = new sap.ui.model.json.JSONModel();
			var promLoadData = oModelItem.loadData("/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder('4500000001')/to_PurchaseOrderItem");
		},

		_onRouteMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product;
			this.getView().bindElement("user1>/d/results/" + this._product);

			var orderNumber = this.getView().getModel("user1").getBindings().at("0").oValue;
			if (orderNumber == null){
				return;
			}
			//oModelItem = new sap.ui.model.json.JSONModel();
			var promLoadData = oModelItem.loadData("/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder('" + orderNumber + "')/to_PurchaseOrderItem")
			var sPath = "/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder('" + orderNumber + "')/to_PurchaseOrderItem";
			promLoadData.then(function () {
				loaded = true;
				this.totalAmount();
				//console.log(oModelItem);
				this.getView().bindElement({
					path: sPath
				});
			}.bind(this));
			this.getView().setModel(oModelItem, "item");

		
			
		},
		loadData: function (sPath) {
			return new Promise(function (resolve, reject) {
				alert("Prom start");
				oModelItem.read( sPath , {
					success: function (oData) {
						alert("Success");
						resolve();
					}.bind(this),
					error: function (oError) {
						reject();
					}.bind(this)
				});
			}.bind(this));
		},

		dateFormatter2: function (Datum) {
			if (Datum == null) {
				return;
			}
			var date = new Date(parseInt(Datum.substring(6, 19)));
			var day = date.getDate();
			var mon = date.getMonth() + 1;
			var year = date.getFullYear();
			return day.toString() + '.' + mon.toString() + '.' + year.toString();

		},
		totalAmount: function () {

			if (loaded == false) {
				return;
			}

			var result = this.getView().getModel("item").oData.d.results[0].NetPriceAmount;
			var count = 1;
			var check = true;
			result = parseFloat(result);

			/* var länge = this.getView().getModel("item").oData.d.results.length; 
			if(länge == null){
				return;
			}
			for(var i=0;i<länge;i++){
				result = result + this.getView().getModel("item").oData.d.results[i].NetPriceAmount.parseFloat();
			} */

			while (false);
			{
				var temp = this.getView().getModel("item").oData.d.results[count].NetPriceAmount;
				temp = parseFloat(temp);
				if (temp != null) {
					result += temp;
					count++;
				} else check = false;
			}
			document.getElementById("__header0-number-number").innerHTML = result.toString();
		},

		totalCount: function (data) {
			var result = "";
			return result;
		},

		onNavBack: function () {
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
