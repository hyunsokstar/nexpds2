// src\widgets\footer\index.tsx
import React from 'react';
import { Resizable } from "re-resizable";

interface Props {}

const CommonFooter = (props: Props) => {
    return (
        <Resizable
            defaultSize={{
                width: '100%',
                height: 130 // 3줄 기본 높이 (3 * 32px)
            }}
            minHeight={150}
            maxHeight={500}
            enable={{ top: true }}
            className="bg-gray-100 border-t"
        >
            <div className="flex flex-col px-2 text-xs text-gray-600 h-full overflow-y-auto">
                <div className="flex items-center h-8">
                    <span className="text-gray-500 w-20">[17:56:27]</span>
                    <span className="text-gray-400 w-14">[Event]</span>
                    <span>캠페인 동작상태 변경, 캠페인 아이디 : 7, 캠페인이름 : pds_web_only, 동작상태 : 중지, 완료구분 : 완료</span>
                </div>
                <div className="flex items-center h-8">
                    <span className="text-gray-500 w-20">[17:56:27]</span>
                    <span className="text-gray-400 w-14">[Event]</span>
                    <span>CIDS 작동 중지</span>
                </div>
                <div className="flex items-center h-8">
                    <span className="text-gray-500 w-20">[17:56:27]</span>
                    <span className="text-gray-400 w-14">[Event]</span>
                    <span>CIDS 작동 중지</span>
                </div>
            </div>
        </Resizable>
    );
};

export default CommonFooter;