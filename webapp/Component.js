

sap.ui.define( ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "sap/ui/Device"], function (UIComponent, JSONModel, Device) {
	"use strict";
	return UIComponent.extend("acceptpurchaseorder.Component", {

		metadata: {
			manifest: "json"
		},

		init : function () {

		
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
var gv_i18nBundle;
jQuery.sap.declare("acceptpurchaseorder.Component");
sap.ui.core.UIComponent.extend("acceptpurchaseorder.Component", {

	
	metadata : {
        stereotype 	: "component", 
        "abstract"	: true,  
        version 	: "1.0",   
        library 	: "acceptpurchaseorder", 	          //required for CSS reference
        includes	: [ "css/Styles.css" ],	  //CSS style reference     
        dependencies: { 			  //external dependencies
            libs 	: ["sap.m", 
                 	   "sap.ui.commons", 
                 	   "sap.ui.ux3", 
                 	   "sap.ui.table", 
                 	   "sap.ui.layout" ], 	 //the libraries that component will be using            
            library	: "sap.ui.core",	 //what library belongs your component to              
        },        
	},	
	
	createContent : function() {
	
		
		// get i18n.properties
		var lv_oBundle = this.get_i18nProperties();
		
		/*		
		Note: i18nModel needs to be called before root view 'sap.ui.view' 
                      i.e. before view creation
		      so that bundle can be accessed at onInit() of Master Page
		*/
		gv_i18nBundle = jQuery.sap.resources({url : lv_oBundle.oData.bundleUrl});				
						
		// create root view
		var oView = sap.ui.view({
			id 			: "app",
			viewName 	: "acceptpurchaseorder.view.App",
			type 		: "JS",
			viewData 	: { component : this }
		});
			
		// set i18n.properties
		oView.setModel(lv_oBundle, "i18n");	
				
		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isPhone 	: jQuery.device.is.phone,
			listMode 	: (jQuery.device.is.phone) ? "None" 	: "SingleSelectMaster",
			listItemType: (jQuery.device.is.phone) ? "Active" 	: "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		oView.setModel(deviceModel, "device");
			
		// done
		return oView;
	},
	
	get_i18nProperties: function(){				
				
		// Get browser's language
		var lv_Locale 	 = window.navigator.language;
		
		var lv_i18nPath;
		if(lv_Locale){		
			lv_i18nPath = "/i18n/i18n_" + lv_Locale + ".properties";	
		}
		
		//set default English script "i18n.properties"
		if(lv_Locale != "hi" || lv_Locale != "en" || lv_Locale != "en-US"){				
			lv_i18nPath = "/i18n/i18n.properties";	
		}
			    	    
	    var lv_bundleUrl = $.sap.getModulePath("acceptpurchaseorder", lv_i18nPath);   
	    var lv_oBundle 	 = new sap.ui.model.resource.ResourceModel({
		      bundleUrl	: lv_bundleUrl,		//"./i18n/i18n_en.properties"		       
		  });	  
	    return lv_oBundle;
    
	},
	
});
