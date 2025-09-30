import {FC} from "react";

import {Avatar} from "../avatar/Avatar";

interface AvatarProps {
    height?: number;
    id?: string;
    initials?: string;
    photo?: string;
    width?: number;
}

interface AvatarStackProps {
    avatars: AvatarProps[];
    size?: number;
}

const AvatarStack: FC<AvatarStackProps> = ({avatars = [], size}) => {
    return (
        <div className="flex flex-row -space-x-[4px]">
            {avatars.map(({height, id, initials, photo, width}) => (
                <div
                    key={id}
                    className="z-20 rounded-full ring-[4px] ring-surface duration-300 hover:-translate-y-[2px] hover:scale-[1.05] hover:transform hover:transition-all">
                    <Avatar
                        size={size}
                        src={photo}
                        name={initials}
                        width={width}
                        height={height}
                    />
                </div>
            ))}
        </div>
    );
};

export {AvatarStack};
