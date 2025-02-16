import { TabBar } from "../tabs/ui/TabBar";
import { TabContent } from "../tabs/ui/TabContent";

export function SplitLayout() {
    return (
      <div className="flex h-full">
        {/* 왼쪽 영역 */}
        <div className="w-1/2 border-r">
          <TabBar position="left" />
          <TabContent position="left" />
        </div>
        {/* 오른쪽 영역 */}
        <div className="w-1/2">
          <TabBar position="right" />
          <TabContent position="right" />
        </div>
      </div>
    );
  }