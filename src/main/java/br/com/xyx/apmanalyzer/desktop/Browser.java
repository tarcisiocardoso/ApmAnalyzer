package br.com.xyx.apmanalyzer.desktop;

import java.io.File;

import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.geometry.HPos;
import javafx.geometry.VPos;
import javafx.scene.Node;
import javafx.scene.control.ButtonType;
import javafx.scene.control.Dialog;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import netscape.javascript.JSObject;

public class Browser extends Region {
 
    final WebView browser = new WebView();
    final WebEngine webEngine = browser.getEngine();
     
    public Browser() {
    	File file = new File("src/main/resources/static/web/index.html");
//    	File file = new File("src/main/resources/static/web/proposta.html");
        //apply the styles
        getStyleClass().add("browser");
        
        
        JSObject window = (JSObject) webEngine.executeScript("window");
        JavaWrapper bridge = new JavaWrapper();
        
        window.setMember("javaWrapper", bridge);
        webEngine.executeScript("console.log = function(message)\n" +
            "{\n" +
            "    javaWrapper.log(message);\n" +
            "};");
        
        try {
        	webEngine.setConfirmHandler(message -> showConfirm(message));
        	String uri = file.toURI().toURL().toString();
			webEngine.load( uri );
	
//			this.browser.getEngine().executeScript("if (!document.getElementById('FirebugLite')){E = document['createElement' + 'NS'] && document.documentElement.namespaceURI;E = E ? document['createElement' + 'NS'](E, 'script') : document['createElement']('script');E['setAttribute']('id', 'FirebugLite');E['setAttribute']('src', 'https://getfirebug.com/' + 'firebug-lite.js' + '#startOpened');E['setAttribute']('FirebugLite', '4');(document['getElementsByTagName']('head')[0] || document['getElementsByTagName']('body')[0]).appendChild(E);E = new Image;E['setAttribute']('src', 'https://getfirebug.com/' + '#startOpened');}");
			
	        com.sun.javafx.webkit.WebConsoleListener.setDefaultListener(new com.sun.javafx.webkit.WebConsoleListener(){
	            @Override
	            public void messageAdded(WebView webView, String message, int lineNumber, String sourceId) {
	                System.out.println("Console: [" + sourceId + ":" + lineNumber + "] " + message);
	            }
	        });
            // load the web page
//          String url = Browser.class.getResource("/index.html").toExternalForm();  
//        	webEngine.load("http://localhost:1234/index.html");

		} catch (Exception e) {
			e.printStackTrace();
		}
        
        
        //add the web view to the scene
        getChildren().add(browser);
 
    }
    
    private void showAlert(String message) {
        Dialog<Void> alert = new Dialog<>();
        alert.getDialogPane().setContentText(message);
        alert.getDialogPane().getButtonTypes().add(ButtonType.OK);
        alert.showAndWait();
    }

    private boolean showConfirm(String message) {
        Dialog<ButtonType> confirm = new Dialog<>();
        confirm.getDialogPane().setContentText(message);
        confirm.getDialogPane().getButtonTypes().addAll(ButtonType.YES, ButtonType.NO);
        boolean result = confirm.showAndWait().filter(ButtonType.YES::equals).isPresent();

        // for debugging:
        System.out.println(result);

        return result ;
    }
    
    private Node createSpacer() {
        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        return spacer;
    }
 
    @Override protected void layoutChildren() {
        double w = getWidth();
        double h = getHeight();
        layoutInArea(browser,0,0,w,h,0, HPos.CENTER, VPos.CENTER);
    }
 
    @Override protected double computePrefWidth(double height) {
        return 750;
    }
 
    @Override protected double computePrefHeight(double width) {
        return 500;
    }
}