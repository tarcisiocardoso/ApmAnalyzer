package com.example;

import java.util.Scanner;

public class Console {

	private String aiai;
	public static void main(String[] args) {
		String x = "xxxx";
		
		System.out.println( System.identityHashCode(x) );
		
		Console c = new Console();
		c.aiai = x;
		c.t(x);
		
		System.out.println( System.identityHashCode(x)+" --> "+x );
		c.t(x);
	}
	public void t(String s){
		System.out.println( System.identityHashCode(s) );
		System.out.println( System.identityHashCode(aiai) );
		
		aiai = "so para ver";
	}
	
	public static void main2(String[] args) {
		Scanner sc = new Scanner(System.in);
		System.out.println("Enter para continuar...");
		String linha = sc.nextLine();
		
		Long tempo = System.currentTimeMillis();
		for(int i=0; i< 1000; i++){
			JavaWrapperTest jwt = new JavaWrapperTest();
			//jwt.testBuscaAnaliseDisco();
		}
		
		System.out.println("["+(System.currentTimeMillis() - tempo )+"]");
		
		System.out.println("...Enter para concluir");
		linha = sc.nextLine();
		
		sc.close(); //Encerra o programa
	}
}
