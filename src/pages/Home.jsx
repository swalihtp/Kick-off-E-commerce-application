import CricketBanner from "../Banners/CricketBanner";
import FootballBanner from "../Banners/footballBanner";
import GymBanner from "../Banners/GymBanner";
import MainBanner from "../Banners/MainBanner";
import SportWearBanner from "../Banners/sportWearBanner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Home(){
    return(
        <>
            <Navbar/>
            <MainBanner/>
            <SportWearBanner/>
            <FootballBanner/>
            <GymBanner/>
            <CricketBanner/>
            <Footer/>

        </>
    );

}
export default Home