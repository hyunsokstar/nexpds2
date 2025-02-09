import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import React, { ReactNode } from 'react';
import { AlertDialogHeader } from '../ui/alert-dialog';
import CommonButton from '../CommonButton';

export interface CustomAlertRequest {
    message: ReactNode;
    title: string;
    type: string;
    isOpen?: boolean;
    onClose: () => void;
    onCancle?: () => void;
    width?: string; // width prop 추가
    showButtons?: boolean;
}

const CustomAlert = ({ 
    message, 
    title,
    type,
    isOpen = true,
    onClose,
    onCancle,
    width = 'max-w-sm', // 기본값 설정
    showButtons = true
}: CustomAlertRequest) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className={`p-0 ${width} rounded-none border shadow-sm`}>
                <AlertDialogHeader className="bg-[#AAA] px-4 py-2 border-b rounded-tl-[.5rem] rounded-tr-[.5rem]">
                    <AlertDialogTitle className="text-sm text-[#fff] font-normal">
                        {title}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="p-4 bg-white rounded-bl-[.5rem] rounded-br-[.5rem]">
                    <div className="text-sm text-gray-700 mb-4">
                        {typeof message === 'string' ? message.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        )) : message}
                    </div>
                    {showButtons && (
                    <div className="flex justify-end gap-1.5">
                        {type === '1' ? (
                            <>
                                <CommonButton onClick={onClose}>
                                    확인
                                </CommonButton>
                                {onCancle && (
                                    <CommonButton 
                                        variant="outline"
                                        onClick={onCancle}>
                                        닫기
                                    </CommonButton>
                                )}
                            </>
                        ) : type === '0' ?(
                            <>
                                <CommonButton onClick={onClose}>
                                    확인
                                </CommonButton>
                                <CommonButton
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    닫기
                                </CommonButton>
                            </>
                        ) : (
                            <>
                                <CommonButton onClick={onClose}>
                                    확인
                                </CommonButton>
                            </>
                        )}
                    </div>
                    )}
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CustomAlert;