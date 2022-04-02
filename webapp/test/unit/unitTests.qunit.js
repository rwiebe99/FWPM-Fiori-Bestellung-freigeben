/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"accept_purchase_order/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
