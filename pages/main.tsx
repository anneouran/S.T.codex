import { createRoot } from "react-dom/client";
import Title from "../app/title/page";
import Prologue from "../app/ep1/EpisodeOne";
import EpisodeOne from "../app/episode-one/Episode";
import EpisodeTwo from "../app/ep2/Episode";
import EpisodeThree from "../app/ep3/Episode";
import EpisodeFour from "../app/ep4/Episode";
import EpisodeFive from "../app/ep5/Episode";
import "../app/globals.css";

const route = window.location.pathname.replace(import.meta.env.BASE_URL, "").replace(/\/$/, "");
const episodes = [Prologue, EpisodeOne, EpisodeTwo, EpisodeThree, EpisodeFour, EpisodeFive];
const match = /^ep([0-5])$/.exec(route);
const Page = match ? episodes[Number(match[1])] : Title;
if (!route) window.history.replaceState(null, "", `${import.meta.env.BASE_URL}title${window.location.hash}`);
createRoot(document.getElementById("root")!).render(<div className="site-viewport"><Page /></div>);
