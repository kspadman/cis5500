"use client";

import "./playerpage.css";
import Image from "next/image";
import {useEffect, useState } from "react";

export default function Page({params} : {params: {player_id: string}}) {

    const [player_id, setPlayer_id] = useState(params.player_id);

    //Before data is loaded, indicate it is loading
    const [player, setPlayer] = useState({
        Name: "Loading", 
        Position: "Loading",
        Height: "Loading",
        Country: "Loading",
        CollegeID: "Loading",
        BirthDate: "Loading",
        TeamID: "Loading",
        TeamName: "Loading",
        AveragePointsPerGame: "Loading",
        AverageAssistsPerGame: "Loading",
        AverageReboundsPerGame: "Loading"
    });

    //Fetch player data
    useEffect(() => {    fetch(`http://localhost:3001/players/${player_id}`, )
        .then(res => res.json())
        .then(data => {
            console.log(data);
            //Format height
            data.Height = data.Height.toString()[0] + "' " + data.Height.toString().substring(1) + "\""

            //Format date
            data.BirthDate = new Date(Date.parse(data.BirthDate));
            data.BirthDate = (data.BirthDate.getMonth() + 1).toString() + "/" + 
                data.BirthDate.getDate().toString() + "/" + data.BirthDate.getFullYear().toString();

            data.AveragePointsPerGame = Math.round(data.AveragePointsPerGame * 10) / 10
            data.AverageAssistsPerGame = Math.round(data.AverageAssistsPerGame * 10) / 10
            data.AverageReboundsPerGame = Math.round(data.AverageReboundsPerGame * 10) / 10


            setPlayer(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, [])

    //This is the player's image
    var img_src = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player_id}.png`

    //Creat e the table for the player's stats
    let table = <table className = "PlayerPage-table">
                    <thead>
                        <tr>
                            <th>Points Per Game</th>
                            <th>Assists Per Game</th>
                            <th>Rebounds Per Game</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                        <tr>
                            <td className = "PlayerPage-table-ppg">{player.AveragePointsPerGame}</td>
                            <td className = "PlayerPage-table-apg">{player.AverageAssistsPerGame}</td>
                            <td className = "PlayerPage-table-rpg">{player.AverageReboundsPerGame} </td>
                        </tr>
                    
                    </tbody>
                </table>
      
    return <div className = "PlayerPage">
        <div className = "PlayerPage-top">
            <div className = "PlayerPage-top-img">
                <Image src = {img_src} style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        width={500}
                        height={300}
                    alt = "Photo of player">

                </Image>
            </div>
            <div className = "PlayerPage-top-description">
                <div className = "PlayerPage-top-name">{player.Name}</div>
                <div className = "PlayerPage-top-info">{player.TeamName} | {player.Position}</div>
                <div className = "PlayerPage-top-stat-summary">
                    <div className = "PlayerPage-top-stat-height">Height: {player.Height}</div>
                    <div className = "PlayerPage-top-stat-nationality">Nationality: {player.Country}</div>
                    <div className = "PlayerPage-top-stat-college">College: {player.CollegeID}</div>
                    <div className = "PlayerPage-top-stat-birthday">Birthday: {player.BirthDate}</div>

                </div>
            </div>
        </div>
        <div className = "PlayerPage-content">
            <div className = "PlayerPage-content-section">
                <div className = "PlayerPage-content-section-header">
                    Stats
                </div>
                <div className = "PlayerPage-content-section-content">
                    {table}
                </div>
            </div>
        </div>

    </div>
}