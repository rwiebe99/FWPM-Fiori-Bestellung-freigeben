sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/Device"], function (Controller, History, Device, formatter) {
	"use strict";

	var oModelItem;
	var orderNumber;
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

			orderNumber = this.getView().getModel("data").getBindings().at("0").oValue;
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

		_onButtonPressAccept: function () {

			sap.m.MessageBox.information("Sind Sie sich sicher, dass sie den Auftrag " + orderNumber + " freigeben möchten?", {
				title: "Information",                                                                       
				styleClass: "",                                      
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],              
				emphasizedAction: sap.m.MessageBox.Action.YES,        
				initialFocus: null,                                
				textDirection: sap.ui.core.TextDirection.Inherit,    
				onClose: function (oAction) {
					if (oAction == sap.m.MessageBox.Action.YES) {

						//Serverübergabe callback

						sap.m.MessageBox.confirm("Der Auftrag " + orderNumber + " wurde erfolgreich freigegeben", {
							title: "Confirm",                                   
							onClose: null,                                    
							styleClass: "",                                   
							actions: [sap.m.MessageBox.Action.OK],        
							emphasizedAction: sap.m.MessageBox.Action.OK,   
							initialFocus: null,                                  
							textDirection: sap.ui.core.TextDirection.Inherit     
						})
					} else
						sap.m.MessageBox.confirm("Der Auftrag " + orderNumber + " wurde nicht freigegeben", {
							title: "Confirm",                                    
							onClose: null,                                      
							styleClass: "",                                      
							actions: [sap.m.MessageBox.Action.OK],         
							emphasizedAction: sap.m.MessageBox.Action.OK,        
							initialFocus: null,                                  
							textDirection: sap.ui.core.TextDirection.Inherit     
						});
				}
			})
		},

		_onButtonPressDecline: function () {

			sap.m.MessageBox.information("Sind Sie sich sicher, dass sie den Auftrag " + orderNumber + " ablehnen möchten?", {
				title: "Information",                                
				styleClass: "",                                      
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],             
				emphasizedAction: sap.m.MessageBox.Action.YES,        
				initialFocus: null,                                 
				textDirection: sap.ui.core.TextDirection.Inherit,
				onClose: function (oAction) {
					if (oAction == sap.m.MessageBox.Action.YES) {

						//Serverübergabe callback

						sap.m.MessageBox.confirm("Der Auftrag " + orderNumber + " wurde erfolgreich abgelehnt", {
							title: "Confirm",                                   
							onClose: null,                                     
							styleClass: "",                                     
							actions: [sap.m.MessageBox.Action.OK],         
							emphasizedAction: sap.m.MessageBox.Action.OK,       
							initialFocus: null,                                 
							textDirection: sap.ui.core.TextDirection.Inherit    
						})
					} else
						sap.m.MessageBox.confirm("Der Auftrag " + orderNumber + " wurde nicht abgelehnt", {
							title: "Confirm",                                  
							onClose: null,                                      
							styleClass: "",                                     
							actions: [sap.m.MessageBox.Action.OK],         
							emphasizedAction: sap.m.MessageBox.Action.OK,        
							initialFocus: null,                                  
							textDirection: sap.ui.core.TextDirection.Inherit     
						});
				}
			});

		},

		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();			
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("master", {}, true);
			}
		}
	});

});
