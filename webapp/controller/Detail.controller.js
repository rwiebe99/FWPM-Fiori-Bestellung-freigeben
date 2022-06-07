sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/Device"], function (Controller, History, Device, formatter) {
	"use strict";

	var oModelItem;
	var loaded = false;
	var base = "/sap/opu/odata/sap/ZOSO_PURCHASEORDER/A_PurchaseOrder";

	return Controller.extend("acceptpurchaseorder.controller.Detail", {

		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("orderDetails").attachPatternMatched(this._onRouteMatched, this);

			var oModel = new sap.ui.model.json.JSONModel(base);
			this.getView().setModel(oModel, "data");
			oModelItem = new sap.ui.model.json.JSONModel();
		},

		_onRouteMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product;
			this.getView().bindElement("data>/d/results/" + this._product);

			var orderNumber = this.getView().getModel("data").getBindings().at("0").oValue;
			if (orderNumber == null) {
				return;
			}
			var link = base + "('" + orderNumber + "')";
			var promLoadData = oModelItem.loadData(link + "/to_PurchaseOrderItem")
			var sPath = link + "/to_PurchaseOrderItem";

			promLoadData.then(function () {
				loaded = true;
				this.totalAmount();
				this.getView().bindElement({
					path: sPath
				});
			}.bind(this));

			this.getView().setModel(oModelItem, "item");

			var oModel = new sap.ui.model.json.JSONModel(link + "/to_PurchaseOrderNote");
			this.getView().setModel(oModel, "notes");

		},
		loadData: function (sPath) {
			return new Promise(function (resolve, reject) {
				alert("Prom start");
				oModelItem.read(sPath, {
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

			var result = 0.0;

			var array = this.getView().getModel("item").oData.d.results;
			array.forEach(function (element) {
				var temp = element.NetPriceAmount
				temp = parseFloat(temp)
				result += temp;
			});

			result = result.toFixed(2);
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
