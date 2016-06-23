package br.com.xyx.apmanalyzer.desktop;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class MainApp extends Application{
	private Scene scene;

	public static void main(String[] args) {
		launch(args);
	}

	@Override
	public void start(Stage stage) throws Exception {
		// TODO Auto-generated method stub
		// create the scene
        stage.setTitle("Web View");
        scene = new Scene(new Browser(),1024, 600, Color.web("#666970"));
        stage.setScene(scene);
        //scene.getStylesheets().add("resource/BrowserToolbar.css");        
        stage.show();		
	}
}
