package gr.uom.strategicplanning.analysis.sonarqube;

import gr.uom.strategicplanning.DashboardApplication;
import gr.uom.strategicplanning.models.domain.Project;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;
import java.util.logging.Logger;

@Component
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SonarAnalysis {

    String projectName;
    String projectOwner;
    String version;
    Logger logger = Logger.getLogger(SonarAnalysis.class.getName());
    private String sonarqubeUrl;

    public SonarAnalysis(Project project, String version, String sonarqubeUrl) throws IOException, InterruptedException {
        this.projectName = project.getName();
        this.projectOwner = project.getOwnerName();
        this.version = version;
        this.sonarqubeUrl = sonarqubeUrl;

        System.out.println("SonarAnalysis Version: " + version);
    }

    private boolean attributesAreEmpty() {
        return projectName.isEmpty() || projectOwner.isEmpty() || version.isEmpty();
    }

    // Create Sonar Properties file
    public SonarAnalysis createSonarFile() throws IOException {
        if (this.attributesAreEmpty()) throw new RuntimeException("Attributes are empty");

        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new FileWriter(new File(System.getProperty("user.dir")+"/repos/" + projectName + "/sonar-project.properties")));
            writer.write("sonar.projectKey=" + projectOwner +":"+ projectName + System.lineSeparator());
            writer.append("sonar.projectName=" + projectOwner +":"+ projectName + System.lineSeparator());
            writer.append("sonar.projectVersion=" + version + System.lineSeparator());
            writer.append("sonar.sourceEncoding=UTF-8" + System.lineSeparator());
            writer.append("sonar.sources=." + System.lineSeparator());
            writer.append("sonar.java.binaries=." + System.lineSeparator());
            writer.append("sonar.host.url=" + sonarqubeUrl + System.lineSeparator());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            writer.close();
        }

        return this;
    }

    private void startAnalysisForWindows(String sonnarScannerDir, String reposDir) throws IOException {
        String batPath = sonnarScannerDir + File.separator + "sonar-scanner-5.0.1.3006-windows" + File.separator + "bin" + File.separator + "sonar-scanner.bat";
        logger.info("batPath: " + batPath);

        String command = "cmd /c cd " + reposDir + File.separator + projectName + " && " + batPath;
        logger.info("command: " + command);

        Process proc = Runtime.getRuntime().exec(command);

        logger.info("SonarQube analysis started for project: " + projectName);
        readProcessStreams(proc);
    }

    private void startAnalysisForLinux(String sonnarScannerDir, String reposDir) throws IOException {
        String bashPath = sonnarScannerDir + File.separator + "sonar-scanner-5.0.1.3006-linux" + File.separator + "bin" + File.separator + "sonar-scanner";
        logger.info("bashPath: " + bashPath);

        String command = "cd '" + reposDir + File.separator + projectName + "' ; " + bashPath;
        logger.info("command: " + command);

        ProcessBuilder pbuilder = new ProcessBuilder("bash", "-c", command);

        File err = new File("err.txt");
        pbuilder.redirectError(err);
        Process p = pbuilder.start();

        logger.info("SonarQube analysis started for project: " + projectName);
        readProcessStreams(p);
    }

    private void startAnalysisBasedOnOS(String sonnarScannerDir, String reposDir) {
        try {
            if (DashboardApplication.isWindows()) {
                startAnalysisForWindows(sonnarScannerDir, reposDir);
            } else {
                startAnalysisForLinux(sonnarScannerDir, reposDir);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Start Analysis with sonar scanner
    public SonarAnalysis startSonarAnalysis() throws IOException, InterruptedException {
        String projectDir = System.getProperty("user.dir");
        String reposDir = projectDir + File.separator + "repos";
        String sonnarScannerDir = projectDir + File.separator + "sonar-scanner";

        logger.info("projectDir: " + projectDir);
        logger.info("reposDir: " + reposDir);
        logger.info("sonnarScannerDir: " + sonnarScannerDir);

        startAnalysisBasedOnOS(sonnarScannerDir, reposDir);

        //wait till sonarqube finishes analysing
        while (!isFinishedAnalyzing()) {
            Thread.sleep(1000);
        }
        Thread.sleep(500);

        return this;
    }

    private void readProcessStreams(Process process) throws IOException {
        BufferedReader inputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String inputLine;
        while ((inputLine = inputReader.readLine()) != null) {
            System.out.println(" " + inputLine);
        }
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        String errorLine;
        while ((errorLine = errorReader.readLine()) != null) {
            System.out.println(errorLine);
            // Show what path could not be found
            if (errorLine.contains("java.io.FileNotFoundException")) {
                System.out.println("File not found: " + errorLine.substring(errorLine.indexOf("java.io.FileNotFoundException")));
            }
        }
    }



    /*
     * Returns if the project is finished being analyzed
     */
    public boolean isFinishedAnalyzing(){
        boolean finished=false;
        try {
            URL url = new URL(sonarqubeUrl +"/api/ce/component?component=" + projectOwner + ":" + projectName);

            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();

            int responsecode = conn.getResponseCode();
            if(responsecode != 200)
                throw new RuntimeException("HttpResponseCode: "+responsecode);

            else {
                Scanner sc = new Scanner(url.openStream());
                while(sc.hasNext()){
                    String line=sc.nextLine();
                    if(line.trim().contains("\"analysisId\":") &&
                            line.trim().contains("\"queue\":[],")){
                        finished=true;
                    }
                }
                sc.close();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return finished;
    }

}
