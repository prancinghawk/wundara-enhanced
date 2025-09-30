import {FC, ReactNode} from "react";

interface SnackbarWrapperProps {
    children: ReactNode;
}

const SnackbarWrapper: FC<SnackbarWrapperProps> = ({
    children,
}: SnackbarWrapperProps) => {
    return (
        <div
            id="wrapper"
            className="fixed inset-x-[16px] inset-y-0 top-auto z-30 flex justify-center">
            <div className="flex w-full justify-center">
                <div className="absolute bottom-[16px] flex w-full flex-col justify-center gap-[12px] sm:min-w-[600px] sm:max-w-[800px]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export {SnackbarWrapper};
