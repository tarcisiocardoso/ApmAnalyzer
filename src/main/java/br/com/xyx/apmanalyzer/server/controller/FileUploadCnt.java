package br.com.xyx.apmanalyzer.server.controller;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import br.com.xyx.apmanalyzer.server.ApmAnalyzerApplication;

@Controller
public class FileUploadCnt {
	
	@RequestMapping("/up/ola")
    @ResponseBody
    String home() {
        return "dentro do upload";
    }
	
	@RequestMapping(method = RequestMethod.GET, value = "/upload")
	@ResponseBody
	public String provideUploadInfo(Model model) {
		System.out.println("......");
		
		File rootFolder = new File(ApmAnalyzerApplication.ROOT);
		
		List<String> fileNames = Arrays.stream(rootFolder.listFiles())
			.map(f -> f.getName())
			.collect(Collectors.toList());

		model.addAttribute("files",
			Arrays.stream(rootFolder.listFiles())
					.sorted(Comparator.comparingLong(f -> -1 * f.lastModified()))
					.map(f -> f.getName())
					.collect(Collectors.toList())
		);

		//return "uploadForm";
		return "teste";
	}

	@RequestMapping(method = RequestMethod.POST, value = "/upload")
	@ResponseBody
	public String handleFileUpload(@RequestParam("file") MultipartFile file) {

		String nome = null;
		if (!file.isEmpty()) {
			String name = file.getName();
			nome = System.currentTimeMillis() + "_"+name;
			if( file.getContentType().endsWith("png")){
				nome += ".png";
			}else{
				nome += ".jpg";
			}
			try {
				BufferedOutputStream stream = new BufferedOutputStream(
						new FileOutputStream(new File(ApmAnalyzerApplication.ROOT + "/" + nome)));
                FileCopyUtils.copy(file.getInputStream(), stream);
				stream.close();
				
			}
			catch (Exception e) {
				return "{ \"sucess\": false, \"erro\": \""+e.getMessage()+"\" }";
			}
		}
		return "{ \"sucess\": true, \"foto\": \"upload/" +nome+"\" }";
	}
}
