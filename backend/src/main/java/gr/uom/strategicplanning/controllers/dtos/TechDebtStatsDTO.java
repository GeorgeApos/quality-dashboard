package gr.uom.strategicplanning.controllers.dtos;

import gr.uom.strategicplanning.controllers.responses.implementations.ProjectResponse;
import gr.uom.strategicplanning.models.stats.TechDebtStats;
import lombok.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class TechDebtStatsDTO {
    private Long id;
    private float totalTechDebt;
    private float averageTechDebt;
    private float averageTechDebtPerLoC;
    private int totalCodeSmells;
    private Long organizationAnalysisId;
    private ProjectResponse projectWithMinTechDebt;
    private ProjectResponse projectWithMaxTechDebt;
    private Collection<ProjectResponse> bestTechDebtProjects;
    private Collection<ProjectResponse> bestCodeSmellProjects;
    private Map<String, Integer> codeSmells;

    public TechDebtStatsDTO(TechDebtStats techDebtStats) {
        this.id = techDebtStats.getId();
        this.totalTechDebt = techDebtStats.getTotalTechDebt();
        this.averageTechDebt = techDebtStats.getAverageTechDebt();
        this.averageTechDebtPerLoC = techDebtStats.getAverageTechDebtPerLoC();
        this.totalCodeSmells = techDebtStats.getTotalCodeSmells();
        this.organizationAnalysisId = techDebtStats.getOrganizationAnalysis().getId();
        this.projectWithMinTechDebt = new ProjectResponse(techDebtStats.getProjectWithMinTechDebt());
        this.projectWithMaxTechDebt = new ProjectResponse(techDebtStats.getProjectWithMaxTechDebt());
        this.bestTechDebtProjects = ProjectResponse.convertToProjectResponseList( (List) techDebtStats.getBestTechDebtProjects());
        this.bestCodeSmellProjects = ProjectResponse.convertToProjectResponseList((List) techDebtStats.getBestCodeSmellProjects());

        this.codeSmells = techDebtStats.getCodeSmells();
    }
}
