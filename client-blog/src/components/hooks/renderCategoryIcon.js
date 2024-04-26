import { MdPriorityHigh, MdPriorityMedium, MdPriorityLow, MdOutlineFeaturedPlayList, MdAutoFixHigh } from 'react-icons/md'; // Import icons for different priority levels
import { FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc";
import { IoBugOutline } from "react-icons/io5";

export default function renderCategoryIcon(category) {
    switch (category) {
        case 'Bug':
            return <IoBugOutline  ></IoBugOutline>;
        case 'Feature':
            return <MdOutlineFeaturedPlayList></MdOutlineFeaturedPlayList>;
        case 'Enhancement':
            return <MdAutoFixHigh></MdAutoFixHigh>
    }
}