import { ReactCarpooling } from "./react-carpooling";
import { Route } from "./route";
import { User } from "./user";

export class AnnouncementCarpooling {

    idCarpoolingAnnouncement!:number;
    dateCarpoolingAnnouncement!:Date;
    description!:string;
    score!:number;
    userAnnCarpooling!:User;
    routeAnnCarpooling!:Route;
}
