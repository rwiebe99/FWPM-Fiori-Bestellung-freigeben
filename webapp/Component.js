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
		
           /*
	    Set i18n model | for Use of Localized Texts in Applications
	    Language:
	    On Eclipse PlateForm: 			lv_Locale = en-US
	    If BrowserDefaultLang English:	lv_Locale = en
	    If BrowserDefaultLang Hindi:	lv_Locale = hi	
	    */	
		
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
