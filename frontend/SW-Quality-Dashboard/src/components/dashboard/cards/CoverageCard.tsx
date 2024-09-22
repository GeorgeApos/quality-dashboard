import React from "react";

function CoverageCard({gridArea, iconA, iconB, iconC, headA, headB, headC, valueA, valueB, valueC}) {
    return (
        <>
            <div
                className="stats shadow bg-base-200"
                id=""
                style={{
                    gridArea: gridArea,
                    overflow: "hidden",
                    padding: "0",
                }}
            >
                <div className="stat">
                    <div className="stat-figure text-info">
                        {iconA}
                    </div>
                    <div className="stat-title">
                        {headA}
                    </div>
                    <div className="stat-value">{valueA}</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-success">
                        {iconB}
                    </div>
                    <div className="stat-title">
                        {headB}
                    </div>
                    <div className="stat-value">{valueB}</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-error">
                        {iconC}
                    </div>
                    <div className="stat-title">
                        {headC}
                    </div>
                    <div className="stat-value">{valueC}</div>
                </div>
            </div>
        </>
    )
}

export default CoverageCard;