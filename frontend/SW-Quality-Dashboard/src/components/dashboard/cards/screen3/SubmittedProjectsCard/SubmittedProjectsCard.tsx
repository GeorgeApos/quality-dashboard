import './SubmittedProjectsCard.css'
import ProjectDetailsIcon from "../../../../ui/ProjectDetailsIcon/ProjectDetailsIcon.tsx";
import starIcon from "../../../../../assets/svg/dashboardIcons/github_stars_icon.svg";
import contributionsIcon from "../../../../../assets/svg/dashboardIcons/contributions_icon.svg";
import useLocalStorage from "../../../../../hooks/useLocalStorage.ts";
import { useEffect, useState } from "react";
import apiUrls from "../../../../../assets/data/api_urls.json";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ErrorModal from "../../../../modals/ErrorModal/ErrorModal.tsx";
import SimpleDashboardCard from "../../SimpleDashboardCard.tsx";
import {truncateString} from "../../../../../utils/textUtils.ts";

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
const GH_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const languageImagesApiUrl = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/"
const noneImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Blue_question_mark_icon.svg/640px-Blue_question_mark_icon.svg.png"


function SubmittedProjectsCard({orgID}) {
    const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
    const [error, setError] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const [submittedProjects, setSubmittedProjects] = useState([]);
    const [selectedProjectName, setSelectedProjectName] = useState("");
    const [selectedProjectOwner, setSelectedProjectOwner] = useState("");
    const [selectedProjectStars, setSelectedProjectStars] = useState(0);
    const [selectedProjectForks, setSelectedProjectForks] = useState(0);
    const [selectedProjectContributions, setSelectedProjectContributions] = useState(0);
    const [selectedProjectLanguage, setSelectedProjectLanguage] = useState("");


    useEffect(() => {
        let url = baseApiUrl + apiUrls.routes.dashboard.projectsInfo;

        // Replace the organization id in the URL
        url = url.replace(":organizationId", orgID);
        let headers = {
            'Content-Type': 'application/json'
        };

        axios.get(url, {headers: headers})
            .then((response) => {
                let data = response.data;

                // Wait half a second to set the state
                setTimeout(() => {
                    setLoading(false);
                }, 1000);

                console.log(data);

                setSubmittedProjects(data);
                getRandomProject(data);
            })
            .catch((error) => {
                setError(true);
                setErrorTitle("Error");
                setErrorMessage(error.response.data.message);
            });
    }, [accessToken]);

    // Every 10 seconds, get a new random project
    useEffect(() => {
        const interval = setInterval(() => {
            getRandomProject(submittedProjects);
        }, 10000);

        return () => clearInterval(interval);
    }, [submittedProjects]);

    function getRandomProject(data) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomProject = data[randomIndex];

        setSelectedProjectName(randomProject.name);
        setSelectedProjectOwner(randomProject.owner);
        setSelectedProjectStars(randomProject.stars);
        setSelectedProjectForks(randomProject.forks);
        setSelectedProjectContributions(randomProject.totalContributions);

        // Use the github API to get the language of the project
        const headers = {
            'Authorization': 'Bearer ' + GH_TOKEN
        }

        axios.get(`https://api.github.com/repos/${randomProject.owner}/${randomProject.name}`, { headers: headers })
            .then((response) => {
                let projLang = response.data.language;

                if (projLang === "C++") projLang = "cplusplus";
                if (projLang === "CSS") projLang = "css3";
                if (projLang === "HTML") projLang = "html5";
                if (projLang === "C#") projLang = "csharp";
                if (projLang === "Shell") projLang = "bash";
                if(projLang === "Jupyter Notebook") projLang = "jupyter";

                setSelectedProjectLanguage(projLang);
            })
            .catch((error) => {
                console.error("Error fetching project language: ", error);
            });
    }


    return (
        <>
        {loading ? (
                <SimpleDashboardCard
                    id={"submittedProjects"}
                    style={{gridArea: "submittedProjects"}}
                    className={"skeleton"}
                />
        ) : (
                <SimpleDashboardCard
                    id={"submittedProjects"}
                    style={{gridArea: "submittedProjects"}}
                >
                        <div className="stat">
                            <div className="stat-title">
                                Submitted Projects
                            </div>
                            <div className="stat-value"
                                 style={{fontSize: "5vh"}}
                            >
                                <a href={"https://github.com/" + selectedProjectOwner + "/" + selectedProjectName} className="link link-hover tooltip tooltip-top" data-tip={selectedProjectName}>
                                    {truncateString(selectedProjectName, 28)}
                                </a>
                            </div>
                            <div className="stat-desc"
                                    style={{
                                        fontSize: "2.5vh",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1vh",
                                        paddingTop: "1vh"
                            }}
                            >
                                By: <a className="link link-hover" href={"https://github.com/" + selectedProjectOwner}>@{selectedProjectOwner}</a>
                            </div>

                            <div className="stat-figure">
                                {/*<i className="bi bi-github" style={{fontSize: "10vh"}}> </i>*/}

                                <div className="mask mask-squircle" >
                                        <img
                                            // src={selectedProjectLanguage ? (languageImagesApiUrl + selectedProjectLanguage.toLowerCase() + "/" + selectedProjectLanguage.toLowerCase() + "-original.svg") : noneImageUrl}
                                            src={languageImagesApiUrl + selectedProjectLanguage.toLowerCase() + "/" + selectedProjectLanguage.toLowerCase() + "-original.svg"}
                                            alt={selectedProjectLanguage}
                                            style={{height: "15vh"}}
                                        />
                                </div>
                            </div>
                        </div>
                </SimpleDashboardCard>
        )}
        </>
    )
}

export default SubmittedProjectsCard;
