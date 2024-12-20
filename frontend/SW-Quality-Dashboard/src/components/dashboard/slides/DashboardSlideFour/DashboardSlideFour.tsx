import './DashboardSlideFour.css'
import '../DashboardSlideStyle.css'
import FooterCard from "../../cards/general/FooterCard/FooterCard.tsx";
import useLocalStorage from "../../../../hooks/useLocalStorage.ts";
import {useEffect, useState} from "react";
import apiUrls from "../../../../assets/data/api_urls.json";
import githubIcon from "../../../../assets/svg/dashboardIcons/forks_icon.svg";
import starIcon from "../../../../assets/svg/dashboardIcons/github_stars_icon.svg";
import MostActiveDeveloperCard from "../../cards/general/ItemActivityCard/MostActiveDeveloperCard.tsx";
import {jwtDecode} from "jwt-decode";
import ProjectCard from "../../cards/screen4/ProjectCard/ProjectCard.tsx";
import WordCloudCard from "../../cards/screen3/WordCloudCard/WordCloudCard.tsx";
import DeveloperInfoCard from "../../cards/general/DeveloperInfoCard.tsx";
import MostActiveProjectCard from "../../cards/general/MostActiveProjectCard.tsx";
import useAxiosGet from "../../../../hooks/useAxios.ts";

const baseApiUrl = import.meta.env.VITE_API_BASE_URL

function DashboardSlideFour({orgID}) {
    const {data: mostActiveDevData, loading: mostActiveDevLoading, error: mostActiveDevError, errorMessage: mostActiveDevErrorMessage} =
        useAxiosGet(baseApiUrl + apiUrls.routes.dashboard.mostActiveDeveloper.replace(":organizationId", orgID), "");

    const {data: developersData, loading: developersLoading, error: developersError, errorMessage: developersErrorMessage} =
        useAxiosGet(baseApiUrl + apiUrls.routes.dashboard.developers.replace(":organizationId", orgID), "");

    const {data: mostActiveProjData, loading: mostActiveProjLoading, error: mostActiveProjError, errorMessage: mostActiveProjErrorMessage} =
        useAxiosGet(baseApiUrl + apiUrls.routes.dashboard.mostActiveProject.replace(":organizationId", orgID), "");

    const {data: mostStarredProjData, loading: mostStarredProjLoading, error: mostStarredProjError, errorMessage: mostStarredProjErrorMessage} =
        useAxiosGet(baseApiUrl + apiUrls.routes.dashboard.mostStarredProject.replace(":organizationId", orgID), "");

    const {data: mostForkedProjData, loading: mostForkedProjLoading, error: mostForkedProjError, errorMessage: mostForkedProjErrorMessage} =
        useAxiosGet(baseApiUrl + apiUrls.routes.dashboard.mostForkedProject.replace(":organizationId", orgID), "");

    const [currentDeveloper, setCurrentDeveloper] = useState({});
    const [developerWords, setDeveloperWords] = useState([]);

    // ----------- DEVELOPER SLIDES LOGIC ------------
    useEffect(() => {
        if (!developersData) return;

        // Every 10 seconds, change the current developer
        let interval = setInterval(() => {
            updateDeveloperSlide();
        }, 10000);

        return () => clearInterval(interval);
    }, [developersData, developersLoading, developersError, developersErrorMessage, currentDeveloper]);

    // ----------- DEVELOPERS WORD CLOUD LOGIC ------------
    useEffect(() => {
        if (!developersData) return;

        let names = []
        developersData.forEach((item) => {
            if (item.name != null) {
                let devItem = {
                    text: item.name,
                    value: Math.floor(Math.random() * 100) + 1
                }
                names.push(devItem)
            }
        })

        setDeveloperWords(names)
    }, [developersData, developersLoading, developersError, developersErrorMessage]);

    function updateDeveloperSlide() {
        let devObj = getRandomDeveloper()
        setCurrentDeveloper(devObj)
    }

    function getRandomDeveloper(defaultDev = false) {
        if (defaultDev) {
            let defaultDev = {
                name: "No Developers",
                avatarUrl: "https://via.placeholder.com/80",
            }
            return defaultDev;
        }

        let randomIndex = Math.floor(Math.random() * developersData.length);
        let randomDev = developersData[randomIndex];
        return randomDev;
    }


    return (
        <>
            <div className="dashboard-slide" id="slide4">
                {mostActiveDevData &&
                    <MostActiveDeveloperCard
                        userUrl={"https://github.com/" + mostActiveDevData.name}
                        username={mostActiveDevData.name}
                        userImg={mostActiveDevData.avatarUrl}
                        commitsCount={mostActiveDevData.totalCommits}
                        issuesCount={mostActiveDevData.totalIssues}
                        issuesPerContibution={mostActiveDevData.issuesPerContribution}

                        gridArea={"mostActiveDev"}
                        loading={mostActiveDevLoading}
                    />
                }

                <MostActiveProjectCard
                    mostActiveProject={mostActiveProjData}
                    loading={mostActiveProjLoading}
                />

                {mostStarredProjData &&
                    <ProjectCard
                        cardHeader={"Most Starred Project"}
                        cardHeaderIcon={"bi bi-bookmark-star"}
                        id={"mostStarredProj"}
                        contentImage={starIcon}
                        projectName={mostStarredProjData.name}
                        nameSubText={mostStarredProjData.owner}
                        totalFiles={mostStarredProjData.files}
                        totalLines={mostStarredProjData.loc}
                        totalDebt={mostStarredProjData.techDebt}
                        totalCodeSmells={mostStarredProjData.totalCodeSmells}
                        totalStars={mostStarredProjData.stars}
                        loading={mostStarredProjLoading}
                    />
                }

                {mostForkedProjData &&
                    <ProjectCard
                        cardHeader={"Most Forked Project"}
                        cardHeaderIcon={"bi bi-git"}
                        id={"mostForked"}
                        contentImage={githubIcon}
                        projectName={mostForkedProjData.name}
                        nameSubText={mostForkedProjData.owner}
                        totalFiles={mostForkedProjData.files}
                        totalLines={mostForkedProjData.loc}
                        totalDebt={mostForkedProjData.techDebt}
                        totalCodeSmells={mostForkedProjData.totalCodeSmells}
                        totalStars={mostForkedProjData.totalForks}
                        loading={mostForkedProjLoading}
                    />
                }

                <DeveloperInfoCard
                    developer={currentDeveloper ? currentDeveloper : {}}
                    developerLoading={developersLoading}
                />

                <WordCloudCard
                    style={{gridArea: "commitGraph"}}
                    words={developerWords}
                    loading={developersLoading}
                    fontSizes={[20, 110]}
                />

                <FooterCard
                    gridAreaName="footerCard"
                />
            </div>
        </>
    )
}

export default DashboardSlideFour