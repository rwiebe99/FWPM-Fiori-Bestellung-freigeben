sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/Device"], function (Controller, History, Device, formatter) {
	"use strict";
	
	return Controller.extend("acceptpurchaseorder.controller.Detail", {

		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("orderDetails").attachPatternMatched(this._onRouteMatched, this);

			var oModel = new sap.ui.model.json.JSONModel("/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder");
			this.getView().setModel(oModel, "user");
		},

		_onRouteMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product;
			this.getView().bindElement("user>/d/results/" + this._product);

			var orderNumber = this.getView().getModel("user").getBindings().at("0").oValue;
			var oModelItem = new sap.ui.model.json.JSONModel("/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder('" + orderNumber + "')/to_PurchaseOrderItem");
			//A_PurchaseOrderItem(PurchaseOrder='" + orderNumber + "',PurchaseOrderItem='1')
			this.getView().setModel(oModelItem, "item");

			var oModelNote = new sap.ui.model.json.JSONModel("/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder('" + orderNumber + "')/to_PurchaseOrderNote");
			this.getView().setModel(oModelNote, "note");

			var sPath = "/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder('" + orderNumber + "')/to_PurchaseOrderItem";

			var promLoadData = this.loadData(sPath);
			promLoadData.then(function () {
				alert("Prom resolved");
				this.getView().bindElement({
					path: sPath
				});
			}.bind(this));

		},
		loadData: function (sPath) {
			return new Promise(function (resolve, reject) {
				alert("Prom start");
				this.getView().getModel().read(sPath, {
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

			if (this.getView().getModel("item") == null) {
				return;
			}

			var result = this.getView().getModel("item").oData.d.results[0].NetPriceAmount;
			var count = 1;
			var check = true;

			/* var länge = this.getView().getModel("item").oData.d.results.length; 
			if(länge == null){
				return;
			}
			for(var i=0;i<länge;i++){
				result = result + this.getView().getModel("item").oData.d.results[i].NetPriceAmount.parseFloat();
			} */

			while (check);
			{
				var temp = this.getView().getModel("item").oData.d.results[count].NetPriceAmount;
				if (temp != null) {
					result += temp;
					count++;
				} else check = false;
			}
			return result;
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
