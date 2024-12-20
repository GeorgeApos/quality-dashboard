package gr.uom.strategicplanning.services;

import gr.uom.strategicplanning.analysis.github.GitClient;
import gr.uom.strategicplanning.analysis.sonarqube.SonarApiClient;
import gr.uom.strategicplanning.models.domain.CodeSmell;
import gr.uom.strategicplanning.models.domain.Commit;
import gr.uom.strategicplanning.models.domain.Developer;
import gr.uom.strategicplanning.models.domain.Project;
import gr.uom.strategicplanning.repositories.CommitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.Optional;

@Service
public class CommitService {

    private CommitRepository commitRepository;
    private DeveloperService developerService;
    private CodeSmellService codeSmellService;
    private final SonarApiClient sonarApiClient;

    @Autowired
    public CommitService(
            DeveloperService developerService,
            CommitRepository commitRepository,
            CodeSmellService codeSmellService,
            @Value("${sonar.sonarqube.url}") String sonarApiUrl
    ) {
        this.developerService = developerService;
        this.commitRepository = commitRepository;
        this.codeSmellService = codeSmellService;
        this.sonarApiClient = new SonarApiClient(sonarApiUrl);
    }

    public void populateCommit(Commit commit, Project project) throws IOException, InterruptedException {
        Date commitDate = GitClient.fetchCommitDate(project, commit);
        commit.setCommitDate(commitDate);

        Developer developer = developerService.populateDeveloperData(project, commit);
        commit.setDeveloper(developer);

        Collection<CodeSmell> codeSmells = codeSmellService.populateCodeSmells(project, commit);
        commit.setCodeSmells(codeSmells);

        int totalCodeSmells = commit.getCodeSmells().size();
        commit.setTotalCodeSmells(totalCodeSmells);

        commit.setProject(project);

        sonarApiClient.fetchCommitData(project, commit);

        saveCommit(commit);
    }

    public Optional<Commit> getCommitByHash(String hash) {
        return commitRepository.findByHash(hash);
    }

    public Collection<Commit> getOrgCommitsByYear(int year, Long orgId) {
        return commitRepository.findOrgCommitsByYear(year, orgId);
    }

    public void saveCommit(Commit commit) {
        commitRepository.save(commit);
    }

    public Commit getCommitByCommitHashOrCreate(String commitId) {
        Optional<Commit> commit = getCommitByHash(commitId);

        if (commit.isPresent()) return commit.get();

        Commit newCommit = new Commit();
        newCommit.setHash(commitId);
        commitRepository.save(newCommit);

        return newCommit;
    }
}
