import {FC} from "react";

interface VideoProps {
    src?: string;
    className?: string;
}

const Video: FC<VideoProps> = ({src, className}: VideoProps) => {
    return (
        <video
            slot="start"
            className={className}
            data-variant="video"
            playsInline
            muted
            autoPlay
            loop
            src={src}
        />
    );
};

export {Video};
