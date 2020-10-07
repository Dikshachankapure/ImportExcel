sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("project.ImportExcel.controller.View1", {
		onInit: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel);
			sap.ui.getCore().setModel(oModel);
		},

		onConfirmDialog: function () {
			var that = this;
			var dialog = new sap.m.Dialog({
				title: "Upload",
				type: "Message",
				icon: "sap-icon://download",
				content: [
					new sap.ui.unified.FileUploader({
						id: "fileuploader",
						width: "100%",
						uploadUrl: "upload/",
						change: function (oEvent) {
							var file = oEvent.getParameter("files")[0];
							if (file && window.FileReader) {
								var reader = new FileReader();
								reader.onload = function (evn) {
									var strCSV = evn.target.result; //string in CSV
									that.csvJSON(strCSV);
								};
								reader.readAsText(file);
							}
							dialog.close();
						}
					})
				],

				endButton: new sap.m.Button({
					text: "cancel",
					press: function () {
						dialog.close();
					}
				}),

				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();

		},

		csvJSON: function (csv) {
			var lines = csv.split("\n");
			var result = [];
			var headers = lines[0].split(",");
			for (var i = 1; i < lines.length; i++) {
				var obj = {};
				var currentline = lines[i].split(",");
				for (var j = 0; j < headers.length; j++) {
					obj[headers[j]] = currentline[j];
				}
				result.push(obj);
			}
			var columnArr = [];
			var oStringResult = JSON.stringify(result);
			for (var key in result[0]) {
				columnArr.push(key);
			}
			var oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, ""));
			sap.ui.getCore().getModel().setProperty("/", oFinalResult);
			var tbl = this.getView().byId("mytbl");
			var col = tbl.getColumns();
			if (col.length > 0) {
				tbl.removeAllColumns();
			}
			for (i = 0; i < columnArr.length; i++) {
				tbl.addColumn(new sap.ui.table.Column({
					label: new sap.ui.commons.Label({
						text: columnArr[i]
					}),
					template: new sap.ui.commons.TextView().bindProperty("text", columnArr[i])
				}));
			}

		}
	});
});