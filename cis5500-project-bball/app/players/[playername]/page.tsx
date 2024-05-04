"use client";

import "./playerpage.css";
import Image from "next/image";
import {useEffect, useState } from "react";

export default function Page({params} : {params: {playername: string}}) {

    const [player, setPlayer] = useState(null);

        useEffect(() => {    fetch('http://localhost:3001/api/user', )
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPlayer(data)})
            .catch(error => console.error('Error fetching data:', error));
    }, [])
      
    return <div className = "PlayerPage">
        <div className = "PlayerPage-top">
            <div className = "PlayerPage-top-img">
                <Image src = "https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png" style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        width={500}
                        height={300}
                    alt = "Photo of player">

                </Image>
            </div>
            <div className = "PlayerPage-top-description">
                <div className = "PlayerPage-top-name">{params.playername}</div>
                <div className = "PlayerPage-top-info">Boston Celtics | #0 | Forward-Guard</div>
                <div className = "PlayerPage-top-stat-summary">
                    <div className = "PlayerPage-top-stat-height">Height: 6' 8</div>
                    <div className = "PlayerPage-top-stat-nationality">Nationality: USA</div>
                    <div className = "PlayerPage-top-stat-college">College: Duke University</div>
                    <div className = "PlayerPage-top-stat-birthday">Birthday: 01/01/1999</div>

                </div>
            </div>
        </div>
        <div className = "PlayerPage-content"></div>

    </div>
}