import "./playerpage.css";
import Image from "next/image";


export default function Page({params} : {params: {playername: string}}) {
    return <div className = "PlayerPage">

        <div className = "PlayerPage-top">
            <div className = "PlayerPage-top-img">
                <Image src = "/" width = {30} height = {30}>

                </Image>
            </div>
            <div className = "PlayerPage-top-description">
                <div className = "PlayerPage-top-name">Jayson Tatum</div>
                <div className = "PlayerPage-top-info">5 points</div>
            </div>
        </div>
        <div className = "PlayerPage-content"></div>

    </div>
}