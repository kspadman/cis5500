"use client";
import "./teampage.css";
import Image from "next/image";

export default function Page({params} : {params: {teamname: string}}) {

    return (<div className = "TeamPage">

<div className = "TeamPage-top">
            <div className = "TeamPage-top-img">
                <Image src = "https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg" style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        width={500}
                        height={300}
                    alt = "Photo of player">

                </Image>
            </div>
            <div className = "TeamPage-top-description">
                <div className = "TeamPage-top-name">{params.teamname}</div>
                <div className = "TeamPage-top-info">Eastern Conference | Atlantic Division</div>
                <div className = "TeamPage-top-stat-summary">
                    <div className = "TeamPage-top-stat-division"></div>

                </div>
            </div>
        </div>

    </div>)
}