import { MdPriorityHigh, MdPriorityMedium, MdPriorityLow, MdOutlineFeaturedPlayList, MdAutoFixHigh } from 'react-icons/md'; // Import icons for different priority levels
import { FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc";
import { IoBugOutline } from "react-icons/io5";
export default function renderPriorityIcon(priority) {
    switch (priority) {
        case 'Low':
            return <FcLowPriority className="mr-2 text-green-500" />;
        case 'Medium':
            return <FcMediumPriority className="mr-2 text-yellow-500" />;
        case 'High':
            return <FcHighPriority className="mr-2 text-red-500" />;
        default:
            return null;
    }
}
