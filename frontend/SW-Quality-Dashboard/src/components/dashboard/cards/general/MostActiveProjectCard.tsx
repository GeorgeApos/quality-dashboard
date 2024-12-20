import SimpleDashboardCard from "../SimpleDashboardCard.tsx";
import {formatText, truncateString} from "../../../../utils/textUtils.ts";
import CountIcon from "../ui/CountIcon.tsx";
import useAxiosGet from "../../../../hooks/useAxios.ts";
import {useEffect} from "react";

const token = import.meta.env.VITE_GITHUB_TOKEN;

export default function MostActiveProjectCard({mostActiveProject, loading}) {
    useEffect(() => {
        console.log(mostActiveProject)
    }, [mostActiveProject]);

    return (
        <>
            {loading ? (
                <SimpleDashboardCard
                    id={"mostActiveProj"}
                    className={"skeleton"}
                    style={{
                        gridArea: "mostActiveProj",
                        width: "100%",
                        height: "100%",
                    }}
                />
            ) : (
                <SimpleDashboardCard
                    id={"mostActiveProj"}
                    style={{
                        gridArea: "mostActiveProj",
                        padding: "0",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <h3 className="header"
                        style={{
                            width: "100%",
                            gap: "2vh",
                            padding: "1vh 2vh",
                            fontSize: "2vh",
                            fontWeight: "bold",
                            margin: "0"
                        }}
                    >
                        <i className="bi bi-rocket-takeoff"> </i>
                        Most Active Project
                    </h3>
                    <div className="card-content"
                         style={{
                             display: "flex",
                             flexDirection: "column",
                             alignItems: "center",
                             justifyContent: "space-between",
                             width: "100%",
                             height: "80%",
                             padding: "0 1vh 1vh 1vh"
                         }}
                    >
                        <div className="project-info"
                             style={{
                                 display: "flex",
                                 flexDirection: "row",
                                 gap: "1vh",
                                 alignItems: "center",
                                 width: "100%",
                             }}
                        >
                            <a className="avatar indicator">
                                <div className="mask mask-squircle"  style={{width: "10vh", height: "10vh"}}>
                                    <img src={`https://avatars.githubusercontent.com/${mostActiveProject.owner}`}/>
                                </div>
                            </a>

                            <div className="project-details" >
                                <h4
                                    style={{
                                        fontSize: "3vh",
                                        fontWeight: "bold",
                                        margin: "0",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {
                                        truncateString(`${mostActiveProject.owner}/${mostActiveProject.name}`, 30)
                                    }
                                    <div className="badge badge-outline"
                                         style={{
                                             fontSize: "1.5vh",
                                             padding: "0.5vh 1vh",
                                             marginLeft: "1.5vh",
                                         }}
                                    >
                                        <i className="bi bi-github"> </i> &nbsp;
                                        {mostActiveProject ? mostActiveProject.defaultBranch : "public"}
                                    </div>
                                </h4>
                                <p
                                    style={{fontSize: "2.1vh"}}
                                >
                                    {mostActiveProject ?
                                        truncateString(mostActiveProject.description, 130) :
                                        "This project has no description"
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="project-stats"
                             style={{
                                 display: "flex",
                                 flexDirection: "row",
                                 height: "100%",
                                 width: "100%",
                                 gap: "5vh",
                                 marginBottom: "5vh",
                                 justifyContent: "space-around",
                                 padding: "2vh 1vh"
                             }}
                        >
                            <CountIcon
                                icon={"bi bi-star"}
                                title={"Stars"}
                                count={formatText(mostActiveProject.stars, "k")}
                            />

                            <CountIcon
                                icon={"bi bi-file-earmark-code"}
                                title={"Files"}
                                count={formatText(mostActiveProject.files, "k")}
                            />

                            <CountIcon
                                icon={"bi bi-text-left"}
                                title={"Lines of Code"}
                                count={formatText(mostActiveProject.loc, "k")}
                            />

                            <CountIcon
                                icon={"bi bi-bezier2"}
                                title={"Commits"}
                                count={formatText(mostActiveProject.totalCommits, "k")}
                            />
                        </div>
                    </div>
                </SimpleDashboardCard>
            )}
        </>
    )
}