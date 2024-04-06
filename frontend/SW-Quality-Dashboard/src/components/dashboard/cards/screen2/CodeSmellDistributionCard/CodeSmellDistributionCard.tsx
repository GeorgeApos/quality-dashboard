import React, {useEffect} from 'react';
import { PieChart } from '@mui/x-charts';
import './CodeSmellDistributionCard.css';
import apiRoutes from '../../../../../assets/data/api_urls.json';
import useLocalStorage from "../../../../../hooks/useLocalStorage.ts";
import * as url from "url";
import axios from "axios";
import ErrorModal from "../../../../modals/ErrorModal/ErrorModal.tsx";
import {jwtDecode} from "jwt-decode";

const colors = {
    "MINOR": "#67B279",
    "MAJOR": "#FDD835",
    "CRITICAL": "#FF7F50",
    "BLOCKER": "#FF5252",
    "INFO": "#58BBFB"
}

function formatText(text) {
    let roundedNum;
    if (!isNaN(text) && parseInt(text) > 1000) {
        const num = parseInt(text);
        roundedNum = Math.round(num / 100) / 10;
        return parseInt(roundedNum) + "k";
    }
    return text;
}

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

function CodeSmellDistributionCard() {
    const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
    const [totalCodeSmells, setTotalCodeSmells] = React.useState(0);
    const [codeSmellDistribution, setCodeSmellDistribution] = React.useState([]);

    const [error, setError] = React.useState(false);
    const [errorTitle, setErrorTitle] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");

    // Call the API to get the language distribution data
    useEffect(() => {
        let url = baseApiUrl + apiRoutes.routes.dashboard.codeSmellDistribution;

        // Get the User Organization from the JWT Token
        let userOrganization = jwtDecode(accessToken).organizationId;

        url = url.replace(":organizationId", userOrganization);

        let headers = {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
        axios.get(url, { headers: headers })
            .then(response => {
                let data = response.data;

                console.info("Code Smell Distribution Data: ", data);

                let totalCodeSmells = response.data.totalCodeSmells;
                let codeSmellDistribution = response.data.codeSmellsDistribution;

                console.log(codeSmellDistribution)

                setTotalCodeSmells(totalCodeSmells);
                setCodeSmellDistribution(codeSmellDistribution);
            })
            .catch(error => {
                console.warn("Error fetching language distribution data: ", error);
                setError(true);
                setErrorTitle("Error fetching language distribution data");
                setErrorMessage("An error occurred while fetching the language distribution data of the organization. Please try again later.");
            });
    }, [accessToken]);


    // Format data for PieChart
    const pieChartData = codeSmellDistribution.map((item, index) => ({
        key: item.severity,
        value: item.count,
        label: item.severity + " (" + item.count + ")",
        color: colors[item.severity]
    }));

    return (
        <>
            {error &&
                <ErrorModal
                    modalTitle={errorTitle}
                    modalAlertMessage={errorMessage}
                />
            }
            <div className="dashboard-card" id="codeSmellDistribution">
                <div className="code-smell-distribution-container">
                    <h3>
                        <i className="bi bi-radioactive"> </i>
                        Code Smell Distribution
                    </h3>
                    <div className="code-smells-distribution-chart">
                        <h2>{formatText(totalCodeSmells)}</h2>

                        <PieChart
                            series={[{
                                data: pieChartData,
                                innerRadius: 104,
                                outerRadius: 144,
                                paddingAngle: 1,
                                cornerRadius: 5,
                                startAngle: -90,
                                highlightScope: { faded: 'global', highlighted: 'item' }
                            }]}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CodeSmellDistributionCard;
