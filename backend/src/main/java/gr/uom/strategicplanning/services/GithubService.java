package gr.uom.strategicplanning.services;

import gr.uom.strategicplanning.analysis.github.GithubApiClient;
import gr.uom.strategicplanning.models.domain.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class GithubService {
    private final GithubApiClient githubApiClient;
    private final ProjectService projectService;

    @Autowired
    public GithubService(ProjectService projectService, @Value("${github.token}") String githubToken) {
        this.githubApiClient = new GithubApiClient(githubToken);
        this.projectService = projectService;
    }

    public void fetchGithubData(Project project) {
        Map<String, Object> githubData = githubApiClient.fetchProjectData(project);

        project.setProjectDescription((String) githubData.get("description"));
        project.setDefaultBranchName((String) githubData.get("defaultBranch"));
        project.setForks((int) githubData.get("totalForks"));
        project.setStars((int) githubData.get("totalStars"));
        project.setTotalCommits((int) githubData.get("totalCommits"));
        project.setCreatedAt((String) githubData.get("createdAt"));
        project.setOpenIssues((int) githubData.get("openIssues"));
        project.setClosedIssues((int) githubData.get("closedIssues"));
        project.setTotalIssues((int) githubData.get("totalIssues"));

        projectService.saveProject(project);
    }

    public boolean isGithubUrlValid(String githubUrl) {
        boolean urlEmpty = githubUrl.isEmpty() || githubUrl.isBlank() || githubUrl == null;
        boolean urlMatchesGithubPattern = !githubUrl.matches("https://github.com/[^/]+/[^/]+" );
        boolean repoExists = githubApiClient.repoFoundByGithubAPI(githubUrl);

        return !urlEmpty && urlMatchesGithubPattern && repoExists;
    }
}
