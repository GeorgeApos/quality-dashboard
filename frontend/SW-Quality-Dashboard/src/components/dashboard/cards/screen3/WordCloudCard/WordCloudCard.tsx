import React, { useState, useEffect } from 'react';
import './WordCloudCard.css';
import WordCloud from "../../../../ui/WordCloud/WordCloud.tsx";
import useLocalStorage from "../../../../../hooks/useLocalStorage.ts";
import apiUrls from "../../../../../assets/data/api_urls.json";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import ErrorModal from "../../../../modals/ErrorModal/ErrorModal.tsx";
import SimpleDashboardCard from "../../SimpleDashboardCard.tsx";
import ReactWordcloud from "react-wordcloud";
import {data} from "autoprefixer";

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

const testWords = [
    {
        text: 'told',
        value: 64,
    },
    {
        text: 'mistake',
        value: 11,
    },
    {
        text: 'thought',
        value: 16,
    },
    {
        text: 'bad',
        value: 17,
    },
]
const WordCloudCard = ({style, words, loading, fontSizes}) => {

    return (
        <>
            {loading ? (
                <SimpleDashboardCard
                    className="skeleton"
                    style={style}
                >
                </SimpleDashboardCard>
            ) : (
                    <SimpleDashboardCard id="wordcloud-card"
                                         style={style}
                    >
                        {words.length > 0 && (
                            // Force re-render by changing key prop
                            <ReactWordcloud
                                words={words}

                                options={{
                                    scale: "linear",
                                    spiral: "rectangular",
                                    fontSizes: fontSizes,
                                    fontFamily: "Anton",
                                    rotations: 0,
                                    enableTooltip: false,
                                    deterministic: true,
                                    padding: 2
                                }}
                            />
                        )}
                    </SimpleDashboardCard>
            )}
        </>
    );
};

export default WordCloudCard;
