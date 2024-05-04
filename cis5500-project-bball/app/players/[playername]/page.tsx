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
                <Image src = "/" width = {30} height = {30} alt = "Photo of player">

                </Image>
            </div>
            <div className = "PlayerPage-top-description">
                <div className = "PlayerPage-top-name">Jayson Tatum</div>
                <div className = "PlayerPage-top-info">5 points</div>
                <div className = "PlayerPage-top-stat-summary">{JSON.stringify(player)}</div>
            </div>
        </div>
        <div className = "PlayerPage-content"></div>

    </div>
}