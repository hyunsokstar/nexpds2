// widgets/tabs/TabBar.tsx
import { X, ArrowLeftRight } from "lucide-react";
import { useMenuStore } from "@/store/tabStore";

export function TabBar({ position }: { position: 'left' | 'right' }) {
 const { 
   leftTabs, 
   rightTabs, 
   activeLeftTabId, 
   activeRightTabId, 
   setActiveTab,
   closeTab,
   moveTabToOtherSide 
 } = useMenuStore();

 // position에 따른 상태 선택
 const tabs = position === 'left' ? leftTabs : rightTabs;
 const activeTabId = position === 'left' ? activeLeftTabId : activeRightTabId;

 if (tabs.length === 0) {
   return null;
 }

 return (
   <div className="relative w-full h-10">
     {/* 탭 바 */}
     <div className="relative border-b px-2 flex items-center justify-between h-10">
       {/* 탭 목록 */}
       <div className="flex items-center space-x-2 flex-1">
         {tabs.map((tab) => (
           <div
             key={tab.id}
             className={`flex items-center px-2 h-8 rounded-t cursor-pointer 
               ${tab.id === activeTabId ? "bg-white border-x border-t border-b-0" : ""}
             `}
             onClick={() => setActiveTab(tab.id, position)}
           >
             <div>{tab.title}</div>
             <button
               className="ml-2 text-gray-400 hover:text-gray-600"
               onClick={(e) => {
                 e.stopPropagation();
                 closeTab(tab.id, position);
               }}
             >
               <X className="w-4 h-4" />
             </button>
           </div>
         ))}
       </div>

       {/* 분할 버튼 */}
       <button 
         className="ml-2 p-1 hover:bg-gray-100 rounded"
         onClick={() => {
           // 현재 활성 탭을 반대편으로 이동
           if (activeTabId) {
             moveTabToOtherSide(activeTabId, position);
           }
         }}
       >
         <ArrowLeftRight className="w-4 h-4" />
       </button>
     </div>
   </div>
 );
}