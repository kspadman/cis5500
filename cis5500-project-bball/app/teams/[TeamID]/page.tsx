"use client";
import "./teampage.css";
import Image from "next/image";
import {useState, useEffect} from "react"

export default function Page({params} : {params: {TeamID: string}}) {

    const [team, setTeam] = useState([{TeamName: "Loading", TeamID: params.TeamID, TeamConference: "Loading", TeamDivision: "Loading"}]);

    useEffect(() => {
        fetch(`http://localhost:3001/teams/${params.TeamID}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setTeam(data)
            console.log(team)
        })
    }, []);

    return (<div className = "TeamPage">

        <div className = "TeamPage-top">
            <div className = "TeamPage-top-img">
                <Image src = {`https://cdn.nba.com/logos/nba/${team[0].TeamID}/primary/L/logo.svg`} style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        width={400}
                        height={500}
                    alt = "Team logo">

                </Image>
            </div>
            <div className = "TeamPage-top-description">
                <div className = "TeamPage-top-name">{team[0].TeamName}</div>
                <div className = "TeamPage-top-info">{team[0].TeamConference} Conference | {team[0].TeamDivision} Division </div>
                <div className = "TeamPage-top-stat-summary">
                    <div className = "TeamPage-top-stat-division"></div>
                            
                </div>
            </div>
        </div>
        <div className = "TeamPage-body">
            <div className = "TeamPage-body-section">
                <div className = "TeamPage-body-section-title">
                    Top Opposition Players by Team
                </div>

            </div>
            <div className = "TeamPage-body-section">
                <div className = "TeamPage-body-section-title">

                </div>

            </div>

        </div>

    </div>)
}